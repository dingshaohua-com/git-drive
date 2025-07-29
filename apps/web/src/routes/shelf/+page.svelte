<script lang="ts">
	import Navbar from '$lib/components/navbar.svelte';
	import { auth } from '$lib/stores/auth';
</script>

<Navbar />

<div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
	<main class="pt-20">
		<div class="max-w-6xl mx-auto px-6 py-12">
			<div class="text-center mb-12">
				<h1 class="text-4xl font-bold text-gray-900 mb-4">我的仓库</h1>
				<p class="text-xl text-gray-600">欢迎回来，{$auth.user?.name || '用户'}！</p>
			</div>

			<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
				<!-- 示例仓库卡片 -->
				<div class="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
					<div class="flex items-center space-x-3 mb-4">
						<div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
							<i class="ri-git-repository-line text-white"></i>
						</div>
						<div>
							<h3 class="font-semibold text-gray-900">示例仓库</h3>
							<p class="text-sm text-gray-500">这是一个示例仓库</p>
						</div>
					</div>
					<p class="text-gray-600 mb-4">这是一个需要登录才能访问的页面，证明鉴权系统工作正常。</p>
					<button class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200">
						查看详情
					</button>
				</div>

				<div class="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
					<div class="flex items-center space-x-3 mb-4">
						<div class="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
							<i class="ri-folder-line text-white"></i>
						</div>
						<div>
							<h3 class="font-semibold text-gray-900">文档仓库</h3>
							<p class="text-sm text-gray-500">存储各种文档</p>
						</div>
					</div>
					<p class="text-gray-600 mb-4">用于存储项目文档、配置文件等。</p>
					<button class="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors duration-200">
						查看详情
					</button>
				</div>

				<div class="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
					<div class="flex items-center space-x-3 mb-4">
						<div class="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
							<i class="ri-image-line text-white"></i>
						</div>
						<div>
							<h3 class="font-semibold text-gray-900">图片仓库</h3>
							<p class="text-sm text-gray-500">存储图片资源</p>
						</div>
					</div>
					<p class="text-gray-600 mb-4">用于存储各种图片资源，支持直链访问。</p>
					<button class="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors duration-200">
						查看详情
					</button>
				</div>
			</div>

			<div class="mt-12 text-center">
				<button class="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl">
					<i class="ri-add-line mr-2"></i>
					添加新仓库
				</button>
			</div>
		</div>
	</main>
</div> 