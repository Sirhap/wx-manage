module.exports = {
	publicPath: "./",
    devServer: {
		// 后端请求转发，此配置仅开发环境有效，生产环境请参考生产环境部署文档配置nginx转发
		port: 8001,
		allowedHosts: "all",
		client: {
			webSocketURL: 'auto://0.0.0.0:0/ws'
		},
		proxy: {
			'/wx': {
				target: 'https://springboot-uh3x-153632-5-1353816286.sh.run.tcloudbase.com',
				changeOrigin: true,
				secure: false
			}
		},
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
			'Access-Control-Allow-Headers': 'Origin, Content-Type, Accept, token'
		}
	},
	configureWebpack:{
		devServer: {
			historyApiFallback: true
		}
	},
	chainWebpack: config => {
		// 移除 prefetch 插件
		config.plugins.delete('prefetch')
	},

	outputDir: undefined,
	assetsDir: undefined,
	runtimeCompiler: undefined,
	productionSourceMap: false,
	parallel: undefined,
	css: undefined
}