import re

# Read the file
with open('lib/screens/home_screen.dart', 'r', encoding='utf-8') as f:
    content = f.read()

# Add debug logging to _buildRecentChanges
old_method_start = '''  Widget _buildRecentChanges() {
    return Consumer<RecentChangesProvider>(
      builder: (context, recentChanges, child) {
        final entries = recentChanges.entries.take(5).toList();
        
        if (entries.isEmpty) {
          return const SizedBox.shrink();
        }'''

new_method_start = '''  Widget _buildRecentChanges() {
    return Consumer<RecentChangesProvider>(
      builder: (context, recentChanges, child) {
        final entries = recentChanges.entries.take(5).toList();
        
        // Debug logging
        print('🔍 [Recent Changes Widget] Total entries: ${recentChanges.entries.length}');
        print('🔍 [Recent Changes Widget] Showing: ${entries.length}');
        if (entries.isNotEmpty) {
          print('🔍 [Recent Changes Widget] First entry: ${entries.first.description}');
        }
        
        if (entries.isEmpty) {
          print('⚠️ [Recent Changes Widget] No entries - widget hidden');
          return const SizedBox.shrink();
        }'''

content = content.replace(old_method_start, new_method_start)

# Write the file
with open('lib/screens/home_screen.dart', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Added debug logging to Recent Changes widget")
print("   Now you'll see in logs if widget is seeing the data")
