var sizeOf = require("image-size");

module.exports = {
  icon: function(mixin, path) {
    path = path.replace(/\"/g, ""); // パス前後の"を削除
    // gulpから引くためのパス
    var path_src = "src/namespaces/" + path;
    // 結果のCSSに出力するパス
    var path_result = "/assets/" + path;
    // サイズを計算
    var dimensions = sizeOf(path_src);
    return {
      "&::after": {
        "content": '""',
        "display": "inline-block",
        "width": dimensions.width,
        "height": dimensions.height,
        "background-image": 'url("' + path_result + '")',
      }
    };
  }
};
