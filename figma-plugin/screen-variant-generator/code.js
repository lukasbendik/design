const PRESETS = {
  ios: {
    label: "iOS",
    variants: [
      {
        id: "ios-mobile",
        label: "iOS Mobile 390",
        width: 390,
        componentMap: {
          "Button/Primary": "iOS/Button/Primary",
          "Input/Text": "iOS/Input/Text"
        }
      },
      {
        id: "ios-tablet",
        label: "iOS Tablet 834",
        width: 834,
        componentMap: {
          "Button/Primary": "iOS/Button/Primary",
          "Input/Text": "iOS/Input/Text"
        }
      }
    ]
  },
  ib: {
    label: "IB",
    variants: [
      {
        id: "ib-mobile",
        label: "IB Mobile 390",
        width: 390,
        componentMap: {
          "iOS/Button/Primary": "IB/Button/Primary",
          "iOS/Input/Text": "IB/Input/Text"
        }
      },
      {
        id: "ib-desktop",
        label: "IB Desktop 1440",
        width: 1440,
        componentMap: {
          "iOS/Button/Primary": "IB/Button/Primary",
          "iOS/Input/Text": "IB/Input/Text"
        }
      }
    ]
  },
  android: {
    label: "Android",
    variants: [
      {
        id: "android-mobile",
        label: "Android Mobile 412",
        width: 412,
        componentMap: {
          "iOS/Button/Primary": "Android/Button/Primary",
          "iOS/Input/Text": "Android/Input/Text"
        }
      }
    ]
  }
};

figma.showUI(__html__, { width: 420, height: 520 });
figma.ui.postMessage({ type: "init", presets: PRESETS });

figma.ui.onmessage = async (msg) => {
  if (msg.type === "create-variant") {
    const selection = figma.currentPage.selection;

    if (selection.length !== 1) {
      figma.notify("Vyber presne jednu obrazovku (Frame).", { error: true });
      return;
    }

    const source = selection[0];
    if (source.type !== "FRAME") {
      figma.notify("Vybrany objekt musi byt Frame.", { error: true });
      return;
    }

    const preset = PRESETS[msg.presetId];
    if (!preset) {
      figma.notify("Neplatny preset.", { error: true });
      return;
    }

    const variant = preset.variants.find((v) => v.id === msg.variantId);
    if (!variant) {
      figma.notify("Neplatna varianta.", { error: true });
      return;
    }

    const clone = source.clone();
    clone.name = msg.customName && msg.customName.trim().length > 0
      ? msg.customName.trim()
      : source.name + " [" + variant.label + "]";

    const gap = 120;
    clone.x = source.x + source.width + gap;
    clone.y = source.y;

    try {
      clone.resizeWithoutConstraints(variant.width, clone.height);
    } catch (_err) {
      figma.notify("Varianta vytvorena, ale resize nebyl mozny u nekterych prvku.");
    }

    const componentByName = buildComponentLookup();
    const swappedCount = swapInstancesByMap(clone, variant.componentMap, componentByName);

    figma.currentPage.selection = [clone];
    figma.viewport.scrollAndZoomIntoView([clone]);

    figma.notify(
      "Hotovo: " + clone.name + " | swapnuto instanci: " + swappedCount,
      { timeout: 3500 }
    );
  }

  if (msg.type === "close") {
    figma.closePlugin();
  }
};

function buildComponentLookup() {
  const lookup = new Map();
  const components = figma.root.findAllWithCriteria({ types: ["COMPONENT"] });
  for (const comp of components) {
    if (!lookup.has(comp.name)) {
      lookup.set(comp.name, comp);
    }
  }
  return lookup;
}

function swapInstancesByMap(root, componentMap, componentByName) {
  let swapped = 0;

  const instances = [];
  collectInstances(root, instances);

  for (const inst of instances) {
    const sourceName = inst.mainComponent ? inst.mainComponent.name : "";
    const targetName = componentMap[sourceName];
    if (!targetName) {
      continue;
    }

    const targetComponent = componentByName.get(targetName);
    if (!targetComponent) {
      continue;
    }

    try {
      inst.swapComponent(targetComponent);
      swapped += 1;
    } catch (_err) {
      // Keep processing remaining instances even if one swap fails.
    }
  }

  return swapped;
}

function collectInstances(node, out) {
  if (node.type === "INSTANCE") {
    out.push(node);
  }

  if ("children" in node) {
    for (const child of node.children) {
      collectInstances(child, out);
    }
  }
}
