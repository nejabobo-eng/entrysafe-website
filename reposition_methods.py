import re

# Read the file
with open('lib/screens/home_screen.dart', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Find and extract the misplaced methods (around line 483)
start_idx = None
end_idx = None
for i, line in enumerate(lines):
    if '  Widget _buildRecentChanges()' in line and start_idx is None:
        # Check if this is the misplaced one (should be after _SummaryCard class)
        if i > 400:  # The misplaced one
            start_idx = i
    if start_idx is not None and end_idx is None:
        if line.strip() == '}' and 'Future<void> _postToLedger' in ''.join(lines[max(0, i-20):i]):
            end_idx = i + 1
            break

if start_idx and end_idx:
    # Extract the methods
    methods = lines[start_idx:end_idx]
    
    # Remove from wrong location
    del lines[start_idx:end_idx]
    
    # Find the correct location (before class _SummaryCard)
    for i, line in enumerate(lines):
        if 'class _SummaryCard extends StatelessWidget {' in line:
            # Insert before this class, after the closing brace of _HomeScreenState
            insert_idx = i - 1  # Before the blank line
            lines[insert_idx:insert_idx] = methods
            print(f"✅ Moved methods from line {start_idx} to line {insert_idx}")
            break
    
    # Write the file
    with open('lib/screens/home_screen.dart', 'w', encoding='utf-8') as f:
        f.writelines(lines)
    
    print("✅ Methods repositioned correctly!")
else:
    print("⚠️ Could not find methods to move")
