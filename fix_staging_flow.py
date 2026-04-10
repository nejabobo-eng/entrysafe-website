import re

# Read the file
with open('lib/screens/ai_command_center_screen.dart', 'r', encoding='utf-8') as f:
    content = f.read()

# Find and replace the section that saves to database AND adds to Recent Changes
old_code = '''      print('🔵 [Auto-Post] TransactionData created successfully');
      print('🔵 [Auto-Post] Saving to database...');
      
      await dataRepo.addTransaction(transactionObj);
      
      _processedTransactionIds.add(previewId);

      print('✅ [Auto-Post] SUCCESS! Saved: $description - R$amount to $account');
      
      // Add to Recent Changes for visibility
      final recentChanges = Provider.of<RecentChangesProvider>(context, listen: false);
      final entry = AITransactionEntry.fromAIJson(aiData);
      entry.status = TransactionStatus.posted;
      recentChanges.addAITransaction(entry);
      
      print('🔔 [Recent Changes] Entry added - visible in app!');

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('✅ Posted to Recent Changes: $description - R${amount.toStringAsFixed(2)}'),
            backgroundColor: Colors.green,
            duration: const Duration(seconds: 3),
          ),
        );'''

new_code = '''      print('🔵 [Auto-Post] TransactionData created successfully');
      print('🔵 [Auto-Post] Adding to Recent Changes (NOT database yet)...');
      
      // === ADD TO RECENT CHANGES (STAGING AREA) ===
      // Do NOT save to database yet - that happens when user taps "Post to Ledger"
      final recentChanges = Provider.of<RecentChangesProvider>(context, listen: false);
      final entry = AITransactionEntry.fromAIJson(aiData);
      entry.status = TransactionStatus.pending; // Mark as PENDING, not posted
      recentChanges.addAITransaction(entry);
      
      _processedTransactionIds.add(previewId);
      
      print('✅ [Auto-Post] SUCCESS! Added to Recent Changes: $description - R$amount');
      print('🔔 [Recent Changes] Entry added - visible in app!');
      print('⏳ [Auto-Post] Transaction is PENDING - user must tap "Post to Ledger" to save to database');

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('✅ Added to Recent Changes: $description - R${amount.toStringAsFixed(2)}\\nTap "Post to Ledger" to save'),
            backgroundColor: Colors.orange,
            duration: const Duration(seconds: 4),
          ),
        );'''

content = content.replace(old_code, new_code)

# Write the file
with open('lib/screens/ai_command_center_screen.dart', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Fixed _autoPostTransaction():")
print("   ❌ REMOVED: dataRepo.addTransaction() - no longer saves to database")
print("   ✅ ADDED: Only adds to RecentChangesProvider with status=pending")
print("   ✅ CHANGED: Snackbar shows orange (pending) instead of green (posted)")
print("   ✅ FLOW: AI → Recent Changes → User verifies → Post to Ledger → Database")
