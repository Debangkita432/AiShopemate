const fs = require("fs");
const path = require("path");

function getRecommendations(currentProduct, allProducts) {
  if (
    !currentProduct ||
    !Array.isArray(allProducts) ||
    allProducts.length === 0
  ) {
    return [];
  }

  return allProducts
    .filter((p) => p.id !== currentProduct.id)
    .map((p) => {
      const sharedTags = p.tags.filter((tag) =>
        currentProduct.tags.includes(tag)
      );
      const tagScore = sharedTags.length;
      const categoryScore = p.category === currentProduct.category ? 1 : 0;
      const relevance = tagScore + categoryScore;

      return { ...p, relevance };
    })
    .filter((p) => p.relevance > 0)
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, 4); //
}

//  Execute if run directly
if (require.main === module) {
  const dataPath = path.join(__dirname, "../data/products.json");

  try {
    const data = fs.readFileSync(dataPath, "utf-8");
    const allProducts = JSON.parse(data);

    //  You can change this index to test different products
    const currentProduct = allProducts[0];

    const recommendations = getRecommendations(currentProduct, allProducts);

    console.log(` Recommendations for "${currentProduct.name}":`);
    recommendations.forEach((rec, i) => {
      console.log(`${i + 1}. ${rec.name} (Score: ${rec.relevance})`);
    });
  } catch (error) {
    console.error(" Error loading products.json:", error.message);
  }
}

// Optional: export for React usage
module.exports = { getRecommendations };
