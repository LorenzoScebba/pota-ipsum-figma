import {PotaIpsum} from "pota-ipsum";

async function loadFont(node: TextNode | TextSublayerNode) {
  if (node.characters.length > 0) {
    const fonts = node.getRangeAllFontNames(0, node.characters.length)
    if (fonts.length > 0) {
      await Promise.all(
        fonts
          .map(figma.loadFontAsync)
      )
    }
    return
  }

  await figma.loadFontAsync({family: "Inter", style: "Regular"})
  node.fontName = {family: "Inter", style: "Regular"}
}

async function run() {
  const selections = figma.currentPage.selection.slice()

  if (selections.length === 0) {
    figma.notify("Please select a text element or a sticky post / shape with text if you're on figjam.")
    return;
  }

  for (const selection of selections) {
    const paragraph = new PotaIpsum().generateSentences(5);

    if (selection.type === "TEXT") {
      await loadFont(selection)
      selection.deleteCharacters(0, selection.characters.length)
      selection.insertCharacters(0, paragraph)
      continue;
    }

    if (selection.type === "STICKY" || selection.type === "SHAPE_WITH_TEXT") {
      await loadFont(selection.text)
      selection.text.deleteCharacters(0, selection.text.characters.length)
      selection.text.insertCharacters(0, paragraph)
      continue;
    }

    figma.notify("Please select a TEXT element or a STICKY post / SHAPE_WITH_TEXT if you're on FigJam.")
  }
}

run()
  .finally(() => figma.closePlugin());