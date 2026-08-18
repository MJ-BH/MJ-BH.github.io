const articles = {
  principles: `
    <h1>Mouhamed Jihed BENHASSEN — Engineering Principles</h1>
    <p><em>Synthesized from Hera, Oolab, beans_site, ASWAN, and Maxit</em></p>
    <hr style="border-color: rgba(255,255,255,0.1); margin: 1.5rem 0;" />
    <h2>Core Pillars of My Codebase Architecture</h2>
    <ol style="padding-left: 1.2rem; line-height: 1.8;">
      <li><strong>Governance & Explicit Rules First:</strong> Every project enforces strict <code>RULES.md</code> or <code>AGENTS.md</code> guidelines. Zero UI pollution. UI components never directly access network or database SDKs.</li>
      <li><strong>Monorepo Modularization:</strong> Domain logic, repositories, and UI components are isolated into clean packages (e.g. <code>packages/app_ui</code>, <code>packages/core</code>).</li>
      <li><strong>Sealed Reactive States:</strong> State management uses <code>BLoC/Cubit</code> (Flutter) or <code>StateFlow&lt;UiState&gt;</code> (Kotlin Compose) with sealed state interfaces (<code>Loading</code>, <code>Success</code>, <code>Error</code>, <code>Empty</code>).</li>
      <li><strong>Zero-Crash Resilience:</strong> Network interceptors handle 401 token refresh loops automatically with background retry logic and offline cache fallbacks.</li>
      <li><strong>Mandatory Automated Testing:</strong> 100% test coverage target for Blocs, ViewModels, and Repositories before feature branches merge into <code>dev</code>.</li>
    </ol>
  `,
  whitelabel: `
    <h1>Architecting White-Label Flutter Applications</h1>
    <p><em>By Mouhamed Jihed BENHASSEN • Senior Full-Stack & Mobile Developer</em></p>
    <hr style="border-color: rgba(255,255,255,0.1); margin: 1.5rem 0;" />
    <h2>Core Architectural Strategy</h2>
    <p>The white-label strategy allows deploying one single code repository for multiple sub-brands, hospitality clients, or regional apps.</p>
    <h3>1. Flutter Build Flavors</h3>
    <p>Using Android Gradle product flavors and iOS Xcode schemes, we bind unique Application IDs, app icons, and environment variables:</p>
    <pre><code>// lib/main_brand_a.dart
void main() {
  final config = AppConfig(
    brandName: 'Alpha Brand',
    primaryColor: Color(0xFF1E3A8A),
    enableTaxiModule: true,
  );
  runApp(WhiteLabelApp(config: config));
}</code></pre>
    <h3>2. Dynamic Theme Extensions</h3>
    <p>By extending <code>ThemeExtension&lt;BrandTheme&gt;</code>, we allow Flutter components to reactively adopt custom colors, fonts, and assets per brand without bloated conditional logic.</p>
    <h3>3. Remote Feature Flags</h3>
    <p>Remote Config and feature flag BLoCs allow turning on/off features dynamically per client tier without resubmitting app builds.</p>
  `,
  webview: `
    <h1>Production-Grade Hybrid WebViews in Flutter</h1>
    <p><em>By Mouhamed Jihed BENHASSEN • Senior Full-Stack & Mobile Developer</em></p>
    <hr style="border-color: rgba(255,255,255,0.1); margin: 1.5rem 0;" />
    <h2>Key Synchronization Patterns</h2>
    <p>When embedding complex web interfaces into Flutter applications, maintaining seamless authentication and bidirectional communication is essential.</p>
    <h3>1. OAuth2 Session Sharing & Header Injection</h3>
    <pre><code>_controller.loadRequest(
  Uri.parse('https://example.com/booking'),
  headers: {
    'Authorization': 'Bearer ' + userToken,
    'X-Client-Platform': 'Flutter-Hybrid',
  },
);</code></pre>
    <h3>2. JavaScript Channels</h3>
    <p>Exposing <code>addJavaScriptChannel('AppNativeBridge')</code> lets web components trigger native device features such as camera scanning, native alerts, or secure local storage.</p>
  `,
  scale: `
    <h1>Scaling Flutter to 1 Million Active Users</h1>
    <p><em>By Mouhamed Jihed BENHASSEN • Senior Full-Stack & Mobile Developer</em></p>
    <hr style="border-color: rgba(255,255,255,0.1); margin: 1.5rem 0;" />
    <h2>High Scale Telecom & E-Commerce Architecture</h2>
    <p>Insights from contributing to <strong>Maxit by Orange</strong> (1M+ active users) and leading <strong>ASWAN</strong> (+10k downloads).</p>
    <ul>
      <li><strong>BLoC State Isolation:</strong> Separating business rules strictly into pure Dart streams.</li>
      <li><strong>Token Interceptors & Automatic Refresh:</strong> Intercepting 401 response codes in Dio to perform seamless token refresh loops.</li>
      <li><strong>Spring Boot Microservices & Redis:</strong> Offloading heavy search and catalog queries to Redis cache layers.</li>
    </ul>
  `,
  matrix: `
    <h1>Enterprise Architecture Competency Matrix</h1>
    <p><em>Candidate: Mouhamed Jihed BENHASSEN • Senior Full-Stack & Mobile Developer</em></p>
    <hr style="border-color: rgba(255,255,255,0.1); margin: 1.5rem 0;" />
    <h2>Core Mobile & Full-Stack Capabilities</h2>
    <table style="width: 100%; border-collapse: collapse; margin-top: 1rem;">
      <tr style="border-bottom: 1px solid rgba(255,255,255,0.1); text-align: left;">
        <th style="padding: 10px;">Engineering Capability</th>
        <th style="padding: 10px;">My Background & Proof of Work</th>
      </tr>
      <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">
        <td style="padding: 10px;"><strong>Flutter & BLoC</strong></td>
        <td style="padding: 10px;">Built & maintained high-concurrency apps (ASWAN, Maxit by Orange).</td>
      </tr>
      <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">
        <td style="padding: 10px;"><strong>White-Label Architecture</strong></td>
        <td style="padding: 10px;">Experience with Flutter Flavors, multi-tenant design tokens, and Remote Config.</td>
      </tr>
      <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">
        <td style="padding: 10px;"><strong>WebView & Hybrid Apps</strong></td>
        <td style="padding: 10px;">Built custom JS bridges, OAuth2 cookie synchronization, and URL interceptors.</td>
      </tr>
      <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">
        <td style="padding: 10px;"><strong>Full Production Ownership</strong></td>
        <td style="padding: 10px;">Managed GitLab CI/CD, Spring Boot APIs, Redis, Docker, and Play Store / App Store releases.</td>
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
