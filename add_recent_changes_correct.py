import re

# Read the file
with open('lib/screens/home_screen.dart', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Add import after premium_provider import
import_added = False
for i, line in enumerate(lines):
    if "'../providers/premium_provider.dart'" in line and "'../providers/recent_changes_provider.dart'" not in ''.join(lines):
        lines.insert(i + 1, "import '../providers/recent_changes_provider.dart';\n")
        print("✅ Added RecentChangesProvider import at line", i + 2)
        import_added = True
        break

if not import_added:
    print("ℹ️ RecentChangesProvider import already exists or couldn't find insertion point")

# Find where to add Recent Changes in the Column
for i, line in enumerate(lines):
    if '_buildQuickActions(context, premiumProvider.isPremium),' in line:
        # Check if _buildRecentChanges is already there
        if '_buildRecentChanges()' not in ''.join(lines[i:i+10]):
            # Find the next _buildComplianceAlerts
            for j in range(i, min(i + 10, len(lines))):
                if '_buildComplianceAlerts(context)' in lines[j]:
                    # Insert before _buildComplianceAlerts
                    lines.insert(j, '              _buildRecentChanges(),\n')
                    lines.insert(j + 1, '              const SizedBox(height: 24),\n')
                    print(f"✅ Added _buildRecentChanges() call at line {j + 1}")
                    break
            break

# Find the closing brace of _HomeScreenState class (before other helper classes)
# Look for the pattern: closing brace followed by blank line and then "class _"
for i in range(len(lines) - 1, 0, -1):
    if (lines[i].strip() == '}' and 
        i + 1 < len(lines) and 
        i + 2 < len(lines) and
        lines[i + 2].startswith('class _')):
        
        # Check if we haven't already added the methods
        if '_buildRecentChanges()' not in ''.join(lines[max(0, i-200):i]):
            # Insert the new methods before this closing brace
            new_methods = '''
  Widget _buildRecentChanges() {
    return Consumer<RecentChangesProvider>(
      builder: (context, recentChanges, child) {
        final entries = recentChanges.recentEntries.take(5).toList();
        
        if (entries.isEmpty) {
          return const SizedBox.shrink();
        }

        return Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.blue.shade50,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: Colors.blue.shade200),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      Icon(Icons.schedule, color: Colors.blue.shade700, size: 20),
                      const SizedBox(width: 8),
                      Text(
                        'Recent AI Changes',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: Colors.blue.shade700,
                        ),
                      ),
                    ],
                  ),
                  if (entries.isNotEmpty)
                    TextButton(
                      onPressed: () {
                        showDialog(
                          context: context,
                          builder: (context) => AlertDialog(
                            title: const Text('Clear All?'),
                            content: const Text('Remove all entries from Recent Changes?'),
                            actions: [
                              TextButton(
                                onPressed: () => Navigator.pop(context),
                                child: const Text('Cancel'),
                              ),
                              TextButton(
                                onPressed: () {
                                  recentChanges.clearAll();
                                  Navigator.pop(context);
                                },
                                child: const Text('Clear', style: TextStyle(color: Colors.red)),
                              ),
                            ],
                          ),
                        );
                      },
                      child: const Text('Clear All'),
                    ),
                ],
              ),
              const SizedBox(height: 12),
              ...entries.map((entry) {
                final timeAgo = _formatTimeAgo(entry.timestamp);
                return Card(
                  margin: const EdgeInsets.only(bottom: 8),
                  child: ListTile(
                    leading: Icon(
                      entry.type == 'INCOME' ? Icons.arrow_downward : Icons.arrow_upward,
                      color: entry.type == 'INCOME' ? Colors.green : Colors.red,
                    ),
                    title: Text(
                      entry.description,
                      style: const TextStyle(fontWeight: FontWeight.w500),
                    ),
                    subtitle: Text('R${entry.amount.toStringAsFixed(2)} • $timeAgo'),
                    trailing: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                          decoration: BoxDecoration(
                            color: entry.status == 'posted' ? Colors.green.shade100 : Colors.orange.shade100,
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Text(
                            entry.status == 'posted' ? 'Posted' : 'Pending',
                            style: TextStyle(
                              fontSize: 11,
                              color: entry.status == 'posted' ? Colors.green.shade900 : Colors.orange.shade900,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                        if (entry.status == 'pending')
                          IconButton(
                            icon: const Icon(Icons.post_add, size: 20),
                            tooltip: 'Post to Ledger',
                            onPressed: () => _postToLedger(context, entry),
                          ),
                      ],
                    ),
                    onTap: () => _showJournalEntryDialog(context, entry),
                  ),
                );
              }).toList(),
            ],
          ),
        );
      },
    );
  }

  String _formatTimeAgo(DateTime timestamp) {
    final now = DateTime.now();
    final difference = now.difference(timestamp);
    
    if (difference.inSeconds < 60) {
      return 'Just now';
    } else if (difference.inMinutes < 60) {
      return '${difference.inMinutes}m ago';
    } else if (difference.inHours < 24) {
      return '${difference.inHours}h ago';
    } else {
      return '${difference.inDays}d ago';
    }
  }

  void _showJournalEntryDialog(BuildContext context, AITransactionEntry entry) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(entry.description),
        content: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              Text('Type: ${entry.type}', style: const TextStyle(fontWeight: FontWeight.w600)),
              const SizedBox(height: 8),
              Text('Amount: R${entry.amount.toStringAsFixed(2)}', style: const TextStyle(fontWeight: FontWeight.w600)),
              const SizedBox(height: 16),
              const Text('Journal Lines:', style: TextStyle(fontWeight: FontWeight.bold)),
              const Divider(),
              ...entry.journalLines.map((line) => Padding(
                padding: const EdgeInsets.symmetric(vertical: 4.0),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Expanded(child: Text(line['account'] ?? 'Unknown')),
                    Text('Dr: R${(line['debit'] ?? 0).toStringAsFixed(2)}', style: const TextStyle(fontSize: 12)),
                    const SizedBox(width: 8),
                    Text('Cr: R${(line['credit'] ?? 0).toStringAsFixed(2)}', style: const TextStyle(fontSize: 12)),
                  ],
                ),
              )).toList(),
            ],
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Close'),
          ),
          if (entry.status == 'pending')
            ElevatedButton(
              onPressed: () {
                Navigator.pop(context);
                _postToLedger(context, entry);
              },
              child: const Text('Post to Ledger'),
            ),
        ],
      ),
    );
  }

  Future<void> _postToLedger(BuildContext context, AITransactionEntry entry) async {
    try {
      final dataRepo = Provider.of<DataRepository>(context, listen: false);
      final recentChanges = Provider.of<RecentChangesProvider>(context, listen: false);
      
      // Convert AI entry to TransactionData
      final transaction = entry.toTransactionData();
      
      // Post to database
      await dataRepo.addTransaction(transaction);
      
      // Mark as posted
      recentChanges.markAsPosted(entry.previewId);
      
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('✅ Posted to Ledger Successfully'),
            backgroundColor: Colors.green,
          ),
        );
      }
    } catch (e) {
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('❌ Failed to post: $e'),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }

'''
            lines.insert(i, new_methods)
            print(f"✅ Added widget methods at line {i + 1}")
            break
        else:
            print("ℹ️ Widget methods already exist")
        break

# Write the file
with open('lib/screens/home_screen.dart', 'w', encoding='utf-8') as f:
    f.writelines(lines)

print("\n✅ Home screen updated successfully!")
