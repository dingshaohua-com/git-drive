<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	// 功能特性数据
	const features = [
		{
			icon: 'ri-git-repository-line',
			title: 'Git仓库管理',
			description: '将Git仓库作为配置存储中心，支持版本控制和协作管理',
			color: 'text-blue-500'
		},
		{
			icon: 'ri-cloud-line',
			title: '云盘同步',
			description: '自动同步本地文件到云端Git仓库，实现跨设备访问',
			color: 'text-green-500'
		},
		{
			icon: 'ri-settings-3-line',
			title: '配置管理',
			description: '统一管理系统配置、应用设置和个性化偏好',
			color: 'text-purple-500'
		},
		{
			icon: 'ri-shield-check-line',
			title: '安全可靠',
			description: '基于Git的版本控制，确保数据安全和可追溯性',
			color: 'text-red-500'
		},
		{
			icon: 'ri-team-line',
			title: '团队协作',
			description: '支持多人协作，实时同步配置变更',
			color: 'text-orange-500'
		},
		{
			icon: 'ri-history-line',
			title: '历史记录',
			description: '完整的配置变更历史，支持回滚和对比',
			color: 'text-indigo-500'
		}
	];

	// 使用场景
	const useCases = [
		{
			title: '开发环境配置',
			description: '管理不同项目的开发环境配置，快速切换和部署',
			icon: 'ri-code-s-slash-line'
		},
		{
			title: '应用设置同步',
			description: '同步各种应用的配置文件，实现多设备一致性',
			icon: 'ri-apps-line'
		},
		{
			title: '系统偏好管理',
			description: '统一管理系统主题、快捷键等个性化设置',
			icon: 'ri-user-settings-line'
		},
		{
			title: '团队配置共享',
			description: '团队成员间共享标准配置，确保开发环境一致',
			icon: 'ri-share-line'
		}
	];

	// 快速开始步骤
	const quickStartSteps = [
		{
			step: '1',
			title: '连接Git仓库',
			description: '绑定你的Git仓库作为配置存储中心'
		},
		{
			step: '2',
			title: '上传配置文件',
			description: '选择需要同步的配置文件上传到仓库'
		},
		{
			step: '3',
			title: '设置同步规则',
			description: '配置自动同步规则和冲突处理策略'
		},
		{
			step: '4',
			title: '开始使用',
			description: '享受跨设备的配置同步体验'
		}
	];

	// 跳转到登录页面
	const goToLogin = () => {
		goto('/login');
	};

	// 跳转到仓库管理
	const goToRepository = () => {
		goto('/shelf');
	};
</script>

<div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
	<!-- 导航栏 -->
	<nav class="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex justify-between items-center h-16">
				<div class="flex items-center space-x-3">
					<div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
						<i class="ri-git-repository-line text-white text-lg"></i>
					</div>
					<span class="text-xl font-bold text-gray-900">GitDriver</span>
				</div>
				<div class="flex items-center space-x-4">
					<button onclick={goToLogin} class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
						登录
					</button>
					<button onclick={goToRepository} class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
						开始使用
					</button>
				</div>
			</div>
		</div>
	</nav>

	<!-- 主要内容 -->
	<main>
		<!-- Hero区域 -->
		<section class="py-20 px-4 sm:px-6 lg:px-8">
			<div class="max-w-4xl mx-auto text-center">
				<h1 class="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
					将Git仓库作为
					<span class="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
						云盘配置系统
					</span>
				</h1>
				<p class="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
					基于Git版本控制的智能配置管理系统，让您的配置文件像代码一样可追踪、可协作、可回滚
				</p>
				<div class="flex flex-col sm:flex-row gap-4 justify-center">
					<button onclick={goToRepository} class="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-medium transition-colors shadow-lg hover:shadow-xl">
						<i class="ri-rocket-line mr-2"></i>
						立即开始
					</button>
					<button class="border border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 px-8 py-4 rounded-lg text-lg font-medium transition-colors">
						<i class="ri-play-circle-line mr-2"></i>
						观看演示
					</button>
				</div>
			</div>
		</section>

		<!-- 功能特性 -->
		<section class="py-20 bg-white">
			<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div class="text-center mb-16">
					<h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
						强大的功能特性
					</h2>
					<p class="text-xl text-gray-600 max-w-3xl mx-auto">
						结合Git的版本控制能力和云盘的便捷性，为您提供最佳的配置管理体验
					</p>
				</div>
				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{#each features as feature}
						<div class="bg-gray-50 rounded-xl p-8 hover:shadow-lg transition-shadow">
							<div class="w-12 h-12 bg-white rounded-lg flex items-center justify-center mb-6 shadow-sm">
								<i class="{feature.icon} {feature.color} text-2xl"></i>
							</div>
							<h3 class="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
							<p class="text-gray-600 leading-relaxed">{feature.description}</p>
						</div>
					{/each}
				</div>
			</div>
		</section>

		<!-- 使用场景 -->
		<section class="py-20 bg-gray-50">
			<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div class="text-center mb-16">
					<h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
						适用场景
					</h2>
					<p class="text-xl text-gray-600 max-w-3xl mx-auto">
						无论您是开发者、设计师还是普通用户，都能找到适合的使用场景
					</p>
				</div>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
					{#each useCases as useCase}
						<div class="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
							<div class="flex items-start space-x-4">
								<div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
									<i class="{useCase.icon} text-blue-500 text-xl"></i>
								</div>
								<div>
									<h3 class="text-xl font-semibold text-gray-900 mb-2">{useCase.title}</h3>
									<p class="text-gray-600 leading-relaxed">{useCase.description}</p>
								</div>
							</div>
						</div>
					{/each}
				</div>
			</div>
		</section>

		<!-- 快速开始 -->
		<section class="py-20 bg-white">
			<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
				<div class="text-center mb-16">
					<h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
						快速开始
					</h2>
					<p class="text-xl text-gray-600">
						只需4个简单步骤，即可开始使用GitDriver
					</p>
				</div>
				<div class="space-y-8">
					{#each quickStartSteps as step}
						<div class="flex items-center space-x-6">
							<div class="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
								{step.step}
							</div>
							<div class="flex-1">
								<h3 class="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
								<p class="text-gray-600">{step.description}</p>
							</div>
						</div>
					{/each}
				</div>
				<div class="text-center mt-12">
					<button onclick={goToRepository} class="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-medium transition-colors shadow-lg hover:shadow-xl">
						<i class="ri-arrow-right-line mr-2"></i>
						开始配置
					</button>
				</div>
			</div>
		</section>

		<!-- 技术优势 -->
		<section class="py-20 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
			<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
				<h2 class="text-3xl md:text-4xl font-bold mb-8">
					技术优势
				</h2>
				<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
					<div>
						<div class="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
							<i class="ri-git-branch-line text-2xl"></i>
						</div>
						<h3 class="text-xl font-semibold mb-3">版本控制</h3>
						<p class="text-blue-100">基于Git的完整版本历史，支持分支管理和合并</p>
					</div>
					<div>
						<div class="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
							<i class="ri-cloud-sync-line text-2xl"></i>
						</div>
						<h3 class="text-xl font-semibold mb-3">实时同步</h3>
						<p class="text-blue-100">自动检测文件变更，实时同步到云端仓库</p>
					</div>
					<div>
						<div class="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
							<i class="ri-shield-keyhole-line text-2xl"></i>
						</div>
						<h3 class="text-xl font-semibold mb-3">安全可靠</h3>
						<p class="text-blue-100">支持SSH密钥和HTTPS认证，确保数据传输安全</p>
					</div>
				</div>
			</div>
		</section>
	</main>

	<!-- 页脚 -->
	<footer class="bg-gray-900 text-white py-12">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="grid grid-cols-1 md:grid-cols-4 gap-8">
				<div>
					<div class="flex items-center space-x-3 mb-4">
						<div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
							<i class="ri-git-repository-line text-white"></i>
						</div>
						<span class="text-xl font-bold">GitDriver</span>
					</div>
					<p class="text-gray-400">
						将Git仓库作为云盘配置系统，让配置管理更简单、更安全、更可靠。
					</p>
				</div>
				<div>
					<h3 class="text-lg font-semibold mb-4">产品</h3>
					<ul class="space-y-2 text-gray-400">
						<li><a href="#" class="hover:text-white transition-colors">功能特性</a></li>
						<li><a href="#" class="hover:text-white transition-colors">定价</a></li>
						<li><a href="#" class="hover:text-white transition-colors">更新日志</a></li>
					</ul>
				</div>
				<div>
					<h3 class="text-lg font-semibold mb-4">支持</h3>
					<ul class="space-y-2 text-gray-400">
						<li><a href="#" class="hover:text-white transition-colors">帮助文档</a></li>
						<li><a href="#" class="hover:text-white transition-colors">API文档</a></li>
						<li><a href="#" class="hover:text-white transition-colors">联系我们</a></li>
					</ul>
				</div>
				<div>
					<h3 class="text-lg font-semibold mb-4">社区</h3>
					<ul class="space-y-2 text-gray-400">
						<li><a href="#" class="hover:text-white transition-colors">GitHub</a></li>
						<li><a href="#" class="hover:text-white transition-colors">讨论区</a></li>
						<li><a href="#" class="hover:text-white transition-colors">贡献指南</a></li>
					</ul>
				</div>
			</div>
			<div class="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
				<p>&copy; 2024 GitDriver. 保留所有权利。</p>
			</div>
		</div>
	</footer>
</div>
