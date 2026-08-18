const articles = {
  flutter_monorepo: `
    <h1>Architecting Enterprise Monorepo Flutter Applications</h1>
    <p><em>By Mouhamed Jihed BENHASSEN • Senior Full-Stack & Mobile Developer</em></p>
    <p><strong>GitHub Repository:</strong> <a href="https://github.com/MJ-BH/blueprint-project-flutter" target="_blank" style="color: var(--accent-cyan);">MJ-BH/blueprint-project-flutter</a> (Public Open-Source)</p>
    <hr style="border-color: rgba(255,255,255,0.1); margin: 1.5rem 0;" />
    <h2>Core Pillars of the Architecture</h2>
    <ol style="padding-left: 1.2rem; line-height: 1.8;">
      <li><strong>VGV Monorepo Package Isolation:</strong> Extracting core infrastructure (<code>packages/core</code>), design tokens (<code>packages/app_ui</code>), and domain repositories (<code>packages/explorer_repository</code>) into independent local packages.</li>
      <li><strong>Result Pattern & Base Infrastructure:</strong> Safe error handling using <code>Result&lt;S, E&gt;</code>, <code>BaseApiService</code>, <code>BaseRepository</code>, <code>BaseMapper&lt;Entity, Dto&gt;</code>, and <code>Logger</code>.</li>
      <li><strong>Scoped On-Demand Dependency Injection:</strong> Injecting repositories and BLoCs on-demand at feature Page/View boundaries.</li>
      <li><strong>Multi-Entrypoint White-Label Support:</strong> Running separate brand apps (<code>main_client_a.dart</code>, <code>main_client_b.dart</code>) from the exact same codebase.</li>
    </ol>
  `,
  android_clean_arch: `
    <h1>Modern Android Clean Architecture with Jetpack Compose & Koin</h1>
    <p><em>By Mouhamed Jihed BENHASSEN • Senior Full-Stack & Mobile Developer</em></p>
    <p><strong>GitHub Repository:</strong> <a href="https://github.com/MJ-BH/android-basic-clean-architecture" target="_blank" style="color: var(--accent-cyan);">MJ-BH/android-basic-clean-architecture</a> (Public Open-Source)</p>
    <hr style="border-color: rgba(255,255,255,0.1); margin: 1.5rem 0;" />
    <h2>Core Architecture Pillars</h2>
    <ol style="padding-left: 1.2rem; line-height: 1.8;">
      <li><strong>Domain Isolation:</strong> Pure Kotlin models, repository interfaces, and use cases with zero Android SDK dependencies.</li>
      <li><strong>Result Pattern & StateFlow UI Streams:</strong> Asynchronous executions return sealed <code>Result&lt;T, Throwable&gt;</code>, mapped into <code>UiState&lt;T&gt;</code> (Loading, Success, Error, Empty).</li>
      <li><strong>Koin Dependency Injection:</strong> Lightweight Kotlin DSL DI module setup (<code>AppModule.kt</code>) providing singletons and <code>koinViewModel()</code> scopes.</li>
      <li><strong>Gradle Product Flavors:</strong> Single codebase powering multi-client white-label deployments (<code>clientA</code>, <code>clientB</code>).</li>
    </ol>
  `,
  microservices_arch: `
    <h1>Enterprise Backend Microservices Architecture</h1>
    <p><em>By Mouhamed Jihed BENHASSEN • Senior Full-Stack & Mobile Developer</em></p>
    <p><strong>GitHub Repository:</strong> <a href="https://github.com/MJ-BH/microservices-blueprint-architecture" target="_blank" style="color: var(--accent-cyan);">MJ-BH/microservices-blueprint-architecture</a> (Public Open-Source)</p>
    <hr style="border-color: rgba(255,255,255,0.1); margin: 1.5rem 0;" />
    <h2>Multi-Stack Implementations (4 Branches)</h2>
    <ol style="padding-left: 1.2rem; line-height: 1.8;">
      <li><strong>master (Node.js/Express):</strong> API Gateway, Auth Service, Explorer Service, Email Service, URL Builder Service.</li>
      <li><strong>refactor/typescript (TypeScript):</strong> Strongly-typed Express services with Repository pattern.</li>
      <li><strong>spring-boot-java (Java 17):</strong> Spring Boot 3, Spring Data JPA, H2/PostgreSQL, Spring Security JWT.</li>
      <li><strong>spring-boot-kotlin (Kotlin 2.0):</strong> Spring Boot 3 with Kotlin Coroutines and non-blocking Flow.</li>
    </ol>
  `,
  principles: `
    <h1>Mouhamed Jihed BENHASSEN — Engineering Principles</h1>
    <p><em>Synthesized from enterprise & open-source projects</em></p>
    <hr style="border-color: rgba(255,255,255,0.1); margin: 1.5rem 0;" />
    <h2>Core Pillars of My Codebase Architecture</h2>
    <ol style="padding-left: 1.2rem; line-height: 1.8;">
      <li><strong>Governance & Explicit Rules First:</strong> Every project enforces strict <code>RULES.md</code> or <code>AGENTS.md</code> guidelines. Zero UI pollution.</li>
      <li><strong>Monorepo & Modular Clean Architecture:</strong> Domain logic, repositories, and UI components are isolated into clean modules.</li>
      <li><strong>Sealed Reactive States:</strong> State management uses <code>BLoC/Cubit</code> (Flutter) or <code>StateFlow&lt;UiState&gt;</code> (Android Kotlin).</li>
      <li><strong>Zero-Crash Resilience:</strong> Result pattern error handling, token refresh interceptors, and robust fallback logic.</li>
    </ol>
  `,
  whitelabel: `
    <h1>Architecting White-Label Mobile Applications</h1>
    <p><em>By Mouhamed Jihed BENHASSEN • Senior Full-Stack & Mobile Developer</em></p>
    <hr style="border-color: rgba(255,255,255,0.1); margin: 1.5rem 0;" />
    <p>The white-label strategy allows deploying one single code repository across multiple client brands using build flavors and dynamic entrypoints.</p>
  `,
  matrix: `
    <h1>Enterprise Architecture Competency Matrix</h1>
    <p><em>Candidate: Mouhamed Jihed BENHASSEN • Senior Full-Stack & Mobile Developer</em></p>
    <hr style="border-color: rgba(255,255,255,0.1); margin: 1.5rem 0;" />
    <table style="width: 100%; border-collapse: collapse; margin-top: 1rem;">
      <tr style="border-bottom: 1px solid rgba(255,255,255,0.1); text-align: left;">
        <th style="padding: 10px;">Engineering Capability</th>
        <th style="padding: 10px;">My Background & Proof of Work</th>
      </tr>
      <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">
        <td style="padding: 10px;"><strong>Flutter & BLoC Monorepo</strong></td>
        <td style="padding: 10px;">VGV Package Architecture, Scoped DI, White-Label targets.</td>
      </tr>
      <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">
        <td style="padding: 10px;"><strong>Android Kotlin Clean Arch</strong></td>
        <td style="padding: 10px;">Jetpack Compose, Koin DI, Ktor Network Interceptors, Product Flavors.</td>
      </tr>
      <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">
        <td style="padding: 10px;"><strong>Spring Boot & Microservices</strong></td>
        <td style="padding: 10px;">Java 17, Kotlin 2.0 Coroutines, Node.js/TypeScript, API Gateway, Docker.</td>
      </tr>
    </table>
  `
};

function filterProjects(category) {
  const buttons = document.querySelectorAll('.filter-btn');
  buttons.forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');

  const cards = document.querySelectorAll('.project-card');
  cards.forEach(card => {
    if (category === 'all' || card.getAttribute('data-category') === category) {
      card.style.display = 'flex';
    } else {
      card.style.display = 'none';
    }
  });
}

function openArticleModal(articleKey) {
  const modal = document.getElementById('articleModal');
  const content = document.getElementById('modalContent');
  if (articles[articleKey]) {
    content.innerHTML = articles[articleKey];
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeArticleModal() {
  const modal = document.getElementById('articleModal');
  modal.classList.remove('active');
  document.body.style.overflow = 'auto';
}

window.onclick = function(event) {
  const modal = document.getElementById('articleModal');
  if (event.target === modal) {
    closeArticleModal();
  }
}
