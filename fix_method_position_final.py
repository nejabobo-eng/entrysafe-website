import re

# Read the file
with open('lib/screens/home_screen.dart', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Find the misplaced _buildRecentChanges and related methods (starting around line 483)
methods_start = None
methods_end = None

for i, line in enumerate(lines):
    if 'Widget _buildRecentChanges()' in line and i > 400:  # The misplaced one
        methods_start = i
    if methods_start and line.strip().startswith('Future<void> _postToLedger'):
        # Find the end of _postToLedger method
        brace_count = 0
        for j in range(i, len(lines)):
            if '{' in lines[j]:
                brace_count += lines[j].count('{')
            if '}' in lines[j]:
                brace_count -= lines[j].count('}')
            if brace_count == 0 and '}' in lines[j]:
                methods_end = j + 1
                break
        break

if methods_start and methods_end:
    # Extract the methods
    methods_block = lines[methods_start:methods_end]
    
    # Remove from wrong location
    del lines[methods_start:methods_end]
    
    # Find where _HomeScreenState class ends (before "class _SummaryCard")
    for i, line in enumerate(lines):
        if line.strip() == '}' and i + 2 < len(lines) and 'class _SummaryCard' in lines[i + 2]:
            # Insert the methods before this closing brace
            lines[i:i] = methods_block
            print(f"✅ Moved {len(methods_block)} lines of methods")
            print(f"   From line {methods_start} to line {i}")
            break
    
    # Write the file
    with open('lib/screens/home_screen.dart', 'w', encoding='utf-8') as f:
        f.writelines(lines)
    
    print("\n✅ Methods repositioned inside _HomeScreenState class!")
else:
    print(f"⚠️ Could not find methods. Found start: {methods_start}, end: {methods_end}")
