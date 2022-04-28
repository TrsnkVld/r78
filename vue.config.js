const webpack = require("webpack");

module.exports = {
	//devServer: { host: '0.0.0.0', port: 8000 },

	productionSourceMap: false,
	filenameHashing: true,

	// глобальные css переменные
	css: {
		loaderOptions: {
			sass: {
				prependData: `@import "@/scss/_variables.scss";`
			}
		}
	},

	configureWebpack: {
		plugins: [
			new webpack.ProvidePlugin({
				mapboxgl: "mapbox-gl",
			}),
		]
	}
};

