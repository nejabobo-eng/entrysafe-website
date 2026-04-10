import 'package:flutter/material.dart';
import '../ai/ai_parser.dart';

class AISuggestionPanel extends StatelessWidget {
  final Map<String, dynamic>? preview;
  final VoidCallback onApprove;
  final VoidCallback onReject;
  final VoidCallback onMarkAsRead;
  final bool isProcessing;

  const AISuggestionPanel({
    Key? key,
    required this.preview,
    required this.onApprove,
    required this.onReject,
    required this.onMarkAsRead,
    this.isProcessing = false,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    // Hide panel if no preview
    if (preview == null) {
      return const SizedBox.shrink();
    }

    final summary = AIParser.summarizeTransaction(preview!);

    return Card(
      margin: const EdgeInsets.all(12),
      elevation: 4,
      color: Colors.blue.shade50,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header
            Row(
              children: [
                Icon(
                  Icons.smart_toy,
                  color: Colors.blue.shade700,
                  size: 24,
                ),
                const SizedBox(width: 8),
                Text(
                  'AI Transaction Suggestion',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: Colors.blue.shade900,
                  ),
                ),
                const Spacer(),
                if (isProcessing)
                  const SizedBox(
                    width: 20,
                    height: 20,
                    child: CircularProgressIndicator(strokeWidth: 2),
                  ),
              ],
            ),
            
            const Divider(height: 24),
            
            // Transaction Summary
            _buildInfoRow('Type', summary.typeLabel, Icons.category),
            const SizedBox(height: 8),
            _buildInfoRow('Amount', summary.formattedAmount, Icons.attach_money),
            const SizedBox(height: 8),
            _buildInfoRow('Description', summary.description, Icons.description),
            
            const SizedBox(height: 16),
            
            // Journal Entry Lines
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: Colors.grey.shade300),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Journal Entry:',
                    style: TextStyle(
                      fontWeight: FontWeight.w600,
                      color: Colors.grey.shade700,
                      fontSize: 12,
                    ),
                  ),
                  const SizedBox(height: 8),
                  ...summary.journalLines.map((line) => Padding(
                    padding: const EdgeInsets.symmetric(vertical: 4),
                    child: Row(
                      children: [
                        Expanded(
                          child: Text(
                            line.accountName,
                            style: const TextStyle(fontSize: 14),
                          ),
                        ),
                        if (line.debit > 0)
                          Text(
                            'DR ${line.formattedDebit}',
                            style: TextStyle(
                              fontWeight: FontWeight.w600,
                              color: Colors.green.shade700,
                            ),
                          ),
                        if (line.credit > 0)
                          Text(
                            'CR ${line.formattedCredit}',
                            style: TextStyle(
                              fontWeight: FontWeight.w600,
                              color: Colors.blue.shade700,
                            ),
                          ),
                      ],
                    ),
                  )).toList(),
                  const Divider(height: 16),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text('Balance Check:',
                          style: TextStyle(fontSize: 12)),
                      Text(
                        'DR: ${summary.totalDebits.toStringAsFixed(2)} | CR: ${summary.totalCredits.toStringAsFixed(2)}',
                        style: TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w600,
                          color: summary.isBalanced
                              ? Colors.green.shade700
                              : Colors.red.shade700,
                        ),
                      ),
                    ],
                  ),
                  if (summary.isBalanced)
                    Row(
                      children: [
                        Icon(Icons.check_circle,
                            color: Colors.green.shade700, size: 16),
                        const SizedBox(width: 4),
                        Text(
                          'Balanced',
                          style: TextStyle(
                            fontSize: 12,
                            color: Colors.green.shade700,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ],
                    ),
                ],
              ),
            ),
            
            const SizedBox(height: 16),
            
            // Action Buttons
            Row(
              children: [
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: isProcessing ? null : onApprove,
                    icon: const Icon(Icons.check_circle),
                    label: const Text('Approve & Post'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.green,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 12),
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: isProcessing ? null : onReject,
                    icon: const Icon(Icons.close),
                    label: const Text('Reject'),
                    style: OutlinedButton.styleFrom(
                      foregroundColor: Colors.red,
                      side: const BorderSide(color: Colors.red),
                      padding: const EdgeInsets.symmetric(vertical: 12),
                    ),
                  ),
                ),
              ],
            ),
            
            const SizedBox(height: 8),
            
            // Mark as Read Button
            SizedBox(
              width: double.infinity,
              child: TextButton.icon(
                onPressed: isProcessing ? null : onMarkAsRead,
                icon: const Icon(Icons.visibility_off, size: 16),
                label: const Text('Mark as Read'),
                style: TextButton.styleFrom(
                  foregroundColor: Colors.grey.shade600,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildInfoRow(String label, String value, IconData icon) {
    return Row(
      children: [
        Icon(icon, size: 16, color: Colors.grey.shade600),
        const SizedBox(width: 8),
        Text(
          '$label: ',
          style: TextStyle(
            fontWeight: FontWeight.w600,
            color: Colors.grey.shade700,
          ),
        ),
        Expanded(
          child: Text(
            value,
            style: const TextStyle(fontSize: 14),
            overflow: TextOverflow.ellipsis,
          ),
        ),
      ],
    );
  }
}
