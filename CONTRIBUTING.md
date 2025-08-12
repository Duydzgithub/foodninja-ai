# Contributing to FoodNinja AI

Cảm ơn bạn quan tâm đến việc contribute cho FoodNinja! 🎉

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- Node.js 16+
- Git
- Code editor (VS Code recommended)

### Setup Development Environment

1. **Fork and Clone**
```bash
git clone https://github.com/your-username/foodninja-ai.git
cd foodninja-ai
```

2. **Backend Setup**
```bash
pip install -r requirements.txt
cp .env.example .env
# Fill in your API keys in .env
python app.py
```

3. **Frontend Setup**
```bash
npm install
cp config.example.js config.js
# Update config.js with your backend URL
```

## 🔧 Development Workflow

### Branch Naming
- Feature: `feature/description`
- Bug fix: `bugfix/description`
- Documentation: `docs/description`
- Refactor: `refactor/description`

### Commit Messages
Follow conventional commits:
- `feat:` new feature
- `fix:` bug fix
- `docs:` documentation
- `style:` formatting
- `refactor:` code refactoring
- `test:` adding tests
- `chore:` maintenance

Example:
```
feat: add voice input for chatbot
fix: resolve camera permission issue on iOS
docs: update API documentation
```

## 🎯 Areas for Contribution

### 🔥 High Priority
- [ ] Add voice input/output for chatbot
- [ ] Implement user accounts and meal tracking
- [ ] Add more regional food databases
- [ ] Improve food recognition accuracy
- [ ] Add nutritional goal setting

### 🚀 Medium Priority
- [ ] Dark mode theme
- [ ] Multiple language support
- [ ] Export meal history to PDF
- [ ] Integration with fitness trackers
- [ ] Recipe suggestions based on ingredients

### 🎨 Enhancement Ideas
- [ ] Barcode scanning for packaged foods
- [ ] Social sharing features
- [ ] Meal planning calendar
- [ ] Nutritionist consultation booking
- [ ] Food allergy warnings

## 🧪 Testing

### Manual Testing Checklist
- [ ] Upload image recognition works
- [ ] Camera capture works on mobile
- [ ] PWA installation works
- [ ] Offline functionality works
- [ ] Chatbot responds correctly
- [ ] Low confidence handling works
- [ ] Responsive design on all devices

### Adding Tests
We welcome test contributions:
- Unit tests for API endpoints
- Integration tests for AI services
- E2E tests for user workflows
- Performance tests

## 📝 Code Style

### Python (Backend)
- Follow PEP 8
- Use type hints where possible
- Add docstrings for functions
- Keep functions focused and small

### JavaScript (Frontend)
- Use ES6+ features
- Use meaningful variable names
- Add comments for complex logic
- Follow consistent indentation

### CSS
- Use CSS custom properties (variables)
- Mobile-first responsive design
- Semantic class names
- Organize by components

## 🔒 Security Guidelines

- Never commit API keys or secrets
- Use environment variables for configuration
- Validate all user inputs
- Follow OWASP security practices
- Report security issues privately

## 📚 Documentation

When contributing:
- Update README.md if needed
- Add/update code comments
- Update API documentation
- Include screenshots for UI changes

## 🤝 Pull Request Process

1. **Before Starting**
   - Check existing issues and PRs
   - Create issue to discuss major changes
   - Fork repository and create feature branch

2. **Development**
   - Write clean, tested code
   - Follow coding standards
   - Update documentation

3. **Submitting PR**
   - Clear title and description
   - Link related issues
   - Add screenshots/videos for UI changes
   - Ensure all checks pass

4. **Review Process**
   - Maintainers will review within 3-5 days
   - Address feedback promptly
   - Maintain conversation professionally

## 🐛 Bug Reports

Use the issue template and include:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Screenshots/videos if applicable
- Environment details (browser, OS, device)

## 💡 Feature Requests

- Check if feature already requested
- Use feature request template
- Explain use case and benefits
- Consider implementation complexity
- Be open to discussion and alternatives

## 🏆 Recognition

Contributors will be:
- Listed in README.md
- Mentioned in release notes
- Added to CONTRIBUTORS.md
- Given credit in about section

## 📞 Getting Help

- 💬 **Discussions**: GitHub Discussions for questions
- 🐛 **Issues**: GitHub Issues for bugs
- 📧 **Email**: admin@example.com for sensitive topics
- 📚 **Docs**: Check docs/ folder first

## 📋 Issue Labels

- `good first issue` - Great for newcomers
- `help wanted` - Community help needed
- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Improvements to docs
- `high priority` - Urgent issues
- `low priority` - Nice to have

## 🎉 Thank You!

Every contribution, no matter how small, makes FoodNinja better for everyone. We appreciate your time and effort! 

---

Happy coding! 🚀
