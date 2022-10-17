import { compare } from "compare-versions";
import { v4 as uuidv4 } from "uuid";

const defaultCategories = {
  version: process.env.REACT_APP_VERSION,
  categories: [
    {
      uuid: uuidv4(),
      name: "My Cards",
      cards: [],
    },
  ],
};

const upgradeStoredCards = (parsedJson) => {
  //If older then version 1.2.x
  if (compare(parsedJson.version, "1.2.0", "<")) {
    if (parsedJson.categories) {
      return parsedJson;
    }
    const newCards = parsedJson.map((card) => {
      return { ...card, uuid: uuidv4(), source: "40k" };
    });
    return {
      ...defaultCategories,
      categories: [{ ...defaultCategories.categories[0], cards: newCards }],
    };
  }
  //Check if cards were saved with the previous version and add the source option.
  if (compare(parsedJson.version, "1.2.0", "=")) {
    return {
      ...parsedJson,
      categories: parsedJson.categories.map((cat) => {
        return {
          ...cat,
          cards: cat.cards.map((card) => {
            return { ...card, source: "40k" };
          }),
        };
      }),
    };
  }
};
export const parseStorageJson = (savedJson) => {
  if (!savedJson) {
    return defaultCategories;
  }

  try {
    const parsedJson = JSON.parse(savedJson.replace(/(<([^>]+)>)/gi, ""));

    if (compare(parsedJson.version, "1.3.0", ">=")) {
      return parsedJson;
    }
    if (compare(parsedJson.version, "1.3.0", "<")) {
      return upgradeStoredCards(parsedJson);
    }
  } catch (e) {
    return defaultCategories;
  }
};