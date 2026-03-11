content = open('lib/screens/home_screen.dart', 'r', encoding='utf-8').read()
content = content.replace('              }).toList(),', '              }),')
open('lib/screens/home_screen.dart', 'w', encoding='utf-8').write(content)
print('✅ Fixed toList() warning')
