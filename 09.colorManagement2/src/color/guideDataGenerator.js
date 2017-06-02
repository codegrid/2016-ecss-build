/* 色変換してくれるライブラリValue */

const Values = require("values.js");

/* 色のマッピングファイルへのパス */

const PATH_COLORMAP = "./all.js";

/* 色変化のバリエーション定義 */

const TINT_PERCENTAGES = [ 30, 50, 70 ];
const SHADE_PERCENTAGES = [ 30, 50, 70 ];
const ALPHA_VALUES = [ -0.2, -0.4, -0.6 ];

module.exports = {

  /* 配列でデータを返す */

  generateAsArray: function() {
    return generateColorArray();
  },

  /* オブジェクトでデータを返す */

  generateAsObject: function() {

    const result = {};
    // とりあえず配列作ってオブジェクトに変換 */
    generateColorArray().forEach(item => {
      result[item.original.label] = convertColorArrayToObject(item);
    });

    return result;
  },

};

/* 色情報の配列を作成する */

function generateColorArray() {

  killCache(); // 色マッピングファイルのキャッシュ削除

  const results = [];
  const colorMap = require(PATH_COLORMAP);

  Object.keys(colorMap).forEach(key => {

    const currentColorItem = {};
    results.push(currentColorItem);

    const varName = '$' + key; // "$red" などの色変数名
    const propertyValue = colorMap[key]; // "#ff0000" などの値
    const v = new Values(propertyValue);

    // オリジナルの色情報を保存
    currentColorItem.original = {
      label: varName,
      value: propertyValue,
      labelColor: calcLabelColor(v),
    };

    // tintのバリエーション作成
    currentColorItem.tints = generateVariations_tint(varName, v);

    // shadeのバリエーション作成
    currentColorItem.shades = generateVariations_shade(varName, v);

    // alphaのバリエーション作成
    currentColorItem.alphas = generateVariations_alpha(varName, v);

  });

  return results;

}

/**
 * バリエーション作成関数群
 */

/* tintのバリエーションを作成する */

function generateVariations_tint(colorVarName, valueInstance) {

  const result = [];
  const v = valueInstance;

  TINT_PERCENTAGES.forEach(percentage => {
    const label = `color(${colorVarName} tint(${percentage}%))`;
    const convertedColorCode = v.tint(percentage).hexString();
    result.push({
      label: label,
      value: convertedColorCode,
      key: `${percentage}%`,
      labelColor: calcLabelColor(v),
    });
  });

  result.reverse();

  return result;

}

/* shadeのバリエーションを作成する */

function generateVariations_shade(colorVarName, valueInstance) {

  const result = [];
  const v = valueInstance;

  SHADE_PERCENTAGES.forEach(percentage => {
    const label = `color(${colorVarName} shade(${percentage}%))`;
    const convertedColorCode = v.shade(percentage).hexString();
    result.push({
      label: label,
      value: convertedColorCode,
      key: `${percentage}%`,
      labelColor: calcLabelColor(v),
    });
  });

  return result;

}

/* alphaのバリエーションを作成する */

function generateVariations_alpha(colorVarName, valueInstance) {

  const result = [];
  const v = valueInstance;

  ALPHA_VALUES.forEach(value => {
    const value_sign = (value >= 0) ? "+" : "-";
    const value_abs = Math.abs(value);
    const label = `color(${colorVarName} alpha(${value_sign} ${value_abs}))`;
    const rgb = v.rgb;
    const convertedColorCode = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${1+value})`;
    result.push({
      label: label,
      value: convertedColorCode,
      key: `${value}%`,
      labelColor: calcLabelColor(v),
    });
  });

  return result;

}

/**
 * 配列オブジェクト変換ヘルパ
 */

/* 色の配列をオブジェクト型式へ変換 */

function convertColorArrayToObject(item) {
  const result = {};
  result.original = item.original;
  ["tints", "shades", "alphas"].forEach(variationName => {
    result[variationName] = convertVariationArrayToObject(item[variationName]);
  });
  return result;
}


/* バリエーションの配列をオブジェクト型式へ変換 */

function convertVariationArrayToObject(array) {
  const result = {};
  array.forEach(item => {
    /* .はmustacheでキーとして引けないので_へ変換 */
    const key = item.key.replace(/\./gi, "_");
    result[key] = item;
  });
  return result;
}


/**
 * その他
 */

/* ラベル用の色計算 */

function calcLabelColor(valueInstance) {

  // 渡された色の上にのせて見えるのは黒か白か判別
  // その色を返す
  // https://stackoverflow.com/questions/5650924/javascript-color-contraster

  const rgb = valueInstance.rgb;
  let brightness = (rgb.r * 299) + (rgb.g * 587) + (rgb.b * 114);
  brightness = brightness / 255000;

  // values range from 0 to 1
  // anything greater than 0.5 should be bright enough for dark text
  if (brightness >= 0.5) {
    return "#000000";
  } else {
    return "#ffffff";
  }

}

/* requireキャッシュ削除 */

function killCache() {
  const colorMapPath = `${__dirname}/${PATH_COLORMAP}`;
  delete require.cache[require.resolve(colorMapPath)];
}
