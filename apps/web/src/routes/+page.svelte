<script lang="ts">
	import { goto } from '$app/navigation';

	const goToRepository = () => {
		goto('/home');
	};
</script>

<div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
	<!-- 导航栏 -->
	<header class="fixed top-0 w-full bg-white/90 backdrop-blur-sm border-b border-gray-100 z-50">
		<div class="max-w-6xl mx-auto px-6">
			<div class="flex justify-between items-center h-20">
				<div class="flex items-center space-x-4">
					<div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
						<i class="ri-git-repository-line text-white text-lg"></i>
					</div>
					<span class="text-xl font-semibold text-gray-900">GitDriver</span>
				</div>
				<button 
					onclick={goToRepository} 
					class="cursor-pointer bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
				>
					开始使用
				</button>
			</div>
		</div>
	</header>

	<!-- 主要内容 -->
	<main class="pt-20">
		<!-- Hero区域 -->
		<section class="min-h-screen flex items-center justify-center px-6">
			<div class="max-w-4xl mx-auto text-center">
				<div class="mb-8">
					<div class="w-24 h-24 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
						<i class="ri-git-repository-line text-white text-4xl"></i>
					</div>
					<h1 class="text-6xl md:text-7xl font-bold mb-6 leading-none">
						<span class="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Git+云盘</span>
					</h1>
				</div>
				<p class="text-2xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
					将Git仓库作为云盘，充分薅仓库平台羊毛
				</p>
			</div>
		</section>

		

		<!-- 特色能力 -->
		<section class="py-32 bg-gradient-to-r from-indigo-50 to-purple-50">
			<div class="max-w-6xl mx-auto px-6">
				<div class="text-center mb-20">
					<h2 class="text-4xl font-bold text-gray-900 mb-4">特色能力</h2>
				</div>
				<div class="space-y-6">
					<div class="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
						<div class="flex items-center space-x-4 mb-4">
							<div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
								<i class="ri-link text-white text-xl"></i>
							</div>
							<h3 class="text-2xl font-bold text-gray-900">链接GIT仓库</h3>
						</div>
						<p class="text-gray-600 text-lg leading-relaxed">
							充分利用<strong>各大仓库平台</strong>的免费空间来存储您的文件，支持链接多个仓库。
						</p>
					</div>
					<div class="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
						<div class="flex items-center space-x-4 mb-4">
							<div class="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
								<i class="ri-folder-settings-line text-white text-xl"></i>
							</div>
							<h3 class="text-2xl font-bold text-gray-900">管理仓库资源</h3>
						</div>
						<p class="text-gray-600 text-lg leading-relaxed">
							对仓库资源直接进行增删等管理，您不必在使用GIT工具提交，更加方便易用！
						</p>
					</div>
					<div class="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
						<div class="flex items-center space-x-4 mb-4">
							<div class="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
								<i class="ri-file-copy-line text-white text-xl"></i>
							</div>
							<h3 class="text-2xl font-bold text-gray-900">文件直连</h3>
						</div>
						<p class="text-gray-600 text-lg leading-relaxed">
							直接显示文件直连地址，便于您在各个场景使用：如图床、配置文件等等！
						</p>
					</div>
				</div>
			</div>
		</section>

		<!-- CTA区域 -->
		<section class="py-32 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
			<div class="max-w-4xl mx-auto px-6 text-center">
				<h2 class="text-4xl font-bold text-white mb-6">准备好开始了吗？</h2>
				<p class="text-xl text-blue-100 mb-12 max-w-2xl mx-auto">
					立即体验Git云盘的强大功能，让您的配置管理更加简单高效
				</p>
				<button 
					onclick={goToRepository}
					class="bg-white text-gray-900 px-8 py-4 rounded-xl text-lg font-medium hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl"
				>
					免费开始使用
				</button>
			</div>
		</section>
	</main>

	<!-- 页脚 -->
	<footer class="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16 text-center">
		<p class="text-sm text-gray-400">&copy; 2025 GitDriver. 保留所有权利。</p>
	</footer>
</div>
