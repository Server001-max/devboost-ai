class AIEngine {
  constructor() {
    this.languages = ['javascript', 'python', 'java', 'csharp', 'go', 'rust', 'php', 'ruby'];
    this.codePatterns = this.loadPatterns();
  }

  loadPatterns() {
    return {
      'optimization': [
        { pattern: /for\s*\(/g, suggestion: 'Use forEach/map for better readability' },
        { pattern: /var\s+/g, suggestion: 'Use const/let instead of var' },
        { pattern: /==/g, suggestion: 'Use === for strict comparison' }
      ],
      'security': [
        { pattern: /eval\(/g, suggestion: 'Avoid eval() - security risk' },
        { pattern: /innerHTML/g, suggestion: 'Use textContent instead of innerHTML' },
        { pattern: /password/g, suggestion: 'Never hardcode passwords' }
      ]
    };
  }

  async analyzeCode(code, language) {
    const analysis = {
      errors: [],
      warnings: [],
      suggestions: [],
      metrics: {
        lines: code.split('\n').length,
        complexity: 0,
        maintainability: 0
      }
    };

    // Check for common issues
    if (code.includes('var ')) {
      analysis.warnings.push('Use const/let instead of var');
    }

    if (code.includes('==') && !code.includes('===')) {
      analysis.warnings.push('Use === for strict equality');
    }

    if (code.includes('eval(')) {
      analysis.errors.push('eval() is a security risk - avoid using it');
    }

    // Calculate complexity
    const complexity = this.calculateComplexity(code);
    analysis.metrics.complexity = complexity;
    analysis.metrics.maintainability = this.calculateMaintainability(code);

    return analysis;
  }

  calculateComplexity(code) {
    // Simple complexity calculation
    const conditions = (code.match(/if\s*\(/g) || []).length;
    const loops = (code.match(/for\s*\(|while\s*\(/g) || []).length;
    return conditions + loops + 1;
  }

  calculateMaintainability(code) {
    const lines = code.split('\n').length;
    const comments = (code.match(/\/\/|\/\*/g) || []).length;
    const score = (comments / lines) * 100;
    return Math.min(score, 100);
  }

  async optimizeCode(code, language) {
    let optimized = code;
    const changes = [];

    // Apply optimizations
    if (code.includes('var ')) {
      optimized = optimized.replace(/var\s+/g, 'const ');
      changes.push('Replaced var with const');
    }

    if (code.includes('for (let')) {
      optimized = optimized.replace(/for\s*\(let/g, 'for (const');
      changes.push('Optimized loop variables');
    }

    // Add strict mode
    if (!code.includes('use strict')) {
      optimized = `'use strict';\n${optimized}`;
      changes.push('Added strict mode');
    }

    return {
      optimized,
      changes,
      improvement: changes.length > 0 ? 'Code optimized successfully' : 'No optimizations needed'
    };
  }

  async generateDocs(code, language) {
    const docs = {
      description: '',
      functions: [],
      parameters: [],
      returns: '',
      examples: []
    };

    // Extract function names
    const functions = code.match(/function\s+(\w+)\s*\(/g) || [];
    docs.functions = functions.map(f => f.replace('function ', '').replace('(', '').trim());

    // Generate description
    docs.description = `This ${language} code contains ${docs.functions.length} function(s).`;

    return docs;
  }

  async generateTests(code, language) {
    const tests = [];
    const functions = code.match(/function\s+(\w+)\s*\([^)]*\)/g) || [];

    functions.forEach(func => {
      const name = func.replace('function ', '').replace(/\([^)]*\)/, '').trim();
      tests.push({
        name: `test_${name}`,
        description: `Test for ${name} function`,
        code: `
  test('${name} should work correctly', () => {
    const result = ${name}();
    expect(result).toBeDefined();
  });
        `.trim()
      });
    });

    return tests;
  }

  async securityScan(code) {
    const issues = [];
    const severity = { high: [], medium: [], low: [] };

    // Check for security issues
    if (code.includes('eval(')) {
      issues.push('eval() usage detected - high risk');
      severity.high.push('eval() is dangerous');
    }

    if (code.includes('password') || code.includes('secret')) {
      issues.push('Possible hardcoded credentials');
      severity.high.push('Hardcoded password/secret detected');
    }

    if (code.includes('innerHTML')) {
      issues.push('innerHTML usage - XSS risk');
      severity.medium.push('Use textContent instead');
    }

    if (code.includes('exec(')) {
      issues.push('Command execution detected');
      severity.high.push('Potential command injection risk');
    }

    return {
      issues,
      severity,
      score: this.calculateSecurityScore(issues.length),
      recommendations: this.generateSecurityRecommendations(issues)
    };
  }

  calculateSecurityScore(issueCount) {
    if (issueCount === 0) return 100;
    if (issueCount <= 2) return 75;
    if (issueCount <= 5) return 50;
    return 25;
  }

  generateSecurityRecommendations(issues) {
    const recommendations = [];
    
    if (issues.some(i => i.includes('eval'))) {
      recommendations.push('Replace eval() with safer alternatives');
    }
    
    if (issues.some(i => i.includes('password'))) {
      recommendations.push('Use environment variables for secrets');
    }
    
    return recommendations;
  }
}

module.exports = new AIEngine();
