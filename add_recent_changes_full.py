import re

# Read the file
with open('lib/screens/home_screen.dart', 'r', encoding='utf-8') as f:
    content = f.read()

# Add import after premium_provider import
if "'../providers/recent_changes_provider.dart'" not in content:
    content = content.replace(
        "import '../providers/premium_provider.dart';",
        "import '../providers/premium_provider.dart';\nimport '../providers/recent_changes_provider.dart';"
    )
    print("✅ Added RecentChangesProvider import")
else:
    print("ℹ️ RecentChangesProvider import already exists")

# Add Recent Changes section before Compliance Alerts
recent_changes_widget = '''
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

# Add the widget method before the closing brace of the class
if '_buildRecentChanges()' not in content:
    # Find the last closing brace of the class
    last_brace_index = content.rfind('}')
    content = content[:last_brace_index] + recent_changes_widget + '\n' + content[last_brace_index:]
    print("✅ Added _buildRecentChanges() widget methods")
else:
    print("ℹ️ _buildRecentChanges() widget already exists")

# Add Recent Changes to the Column children
if '_buildRecentChanges(),' not in content:
    content = content.replace(
        '_buildQuickActions(context, premiumProvider.isPremium),\n              const SizedBox(height: 24),\n              _buildComplianceAlerts(context),',
        '''_buildQuickActions(context, premiumProvider.isPremium),
              const SizedBox(height: 24),
              _buildRecentChanges(),
              const SizedBox(height: 24),
              _buildComplianceAlerts(context),'''
    )
    print("✅ Added Recent Changes section to home screen layout")
else:
    print("ℹ️ Recent Changes section already in layout")

# Write the file
with open('lib/screens/home_screen.dart', 'w', encoding='utf-8') as f:
    f.write(content)

print("\n✅ Home screen updated successfully!")
print("\nNext steps:")
print("1. Run: flutter run")
print("2. Open AI Command Center")
print("3. Send command: 'add r500 income from services'")
print("4. Go back to home screen")
print("5. Check Recent Changes section")
