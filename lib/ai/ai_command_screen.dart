import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:provider/provider.dart';

import '../models/user_profile.dart';
import 'ai_command_service.dart';
import 'ai_error_handler.dart';
import 'ai_logger.dart';
import 'ai_parser.dart';
import 'ai_transaction_router.dart';
import 'ai_state_provider.dart';

/// Modern AI Assistant screen using multi-file architecture
/// Separates concerns: UI → Service → Error Handling → Logging → Parsing → Routing
class AICommandScreen extends StatefulWidget {
  const AICommandScreen({Key? key}) : super(key: key);

  @override
  State<AICommandScreen> createState() => _AICommandScreenState();
}

class _AICommandScreenState extends State<AICommandScreen> {
  final TextEditingController _messageController = TextEditingController();
  final ScrollController _scrollController = ScrollController();
  
  late AICommandService _aiService;
  late AIStateProvider _aiState;
  
  UserProfile? _userProfile;
  bool _isInitialized = false;

  @override
  void initState() {
    super.initState();
    _initializeServices();
  }

  Future<void> _initializeServices() async {
    try {
      final user = FirebaseAuth.instance.currentUser;
      if (user == null) {
        AILogger.logError('No authenticated user', 'User not logged in');
        return;
      }

      // Load user profile
      final doc = await FirebaseFirestore.instance
          .collection('users')
          .doc(user.uid)
          .get();

      if (doc.exists) {
        setState(() {
          _userProfile = UserProfile.fromMap(doc.data()!);
          _aiService = AICommandService();
          _aiState = Provider.of<AIStateProvider>(context, listen: false);
          _isInitialized = true;
        });
        AILogger.logInfo('✅ AI services initialized');
      }
    } catch (e) {
      AILogger.logError('Failed to initialize AI services', e.toString());
      setState(() {
        _isInitialized = false;
      });
    }
  }

  @override
  void dispose() {
    _messageController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  Future<void> _sendCommand() async {
    if (_messageController.text.trim().isEmpty) return;
    if (_userProfile == null) {
      _showError('User profile not loaded');
      return;
    }

    final message = _messageController.text.trim();
    _messageController.clear();

    final aiState = Provider.of<AIStateProvider>(context, listen: false);
    await aiState.startCommand(message);

    try {
      // Send command via service
      final response = await _aiService.sendCommand(
        message: message,
        userId: _userProfile!.uid,
        companyId: _userProfile!.companyId, // Optional - backend auto-creates
      );

      AILogger.logResponse(200, response);

      // Validate response
      final validation = AIParser.validateResponse(response);
      
      if (!validation.isValid) {
        throw Exception('Invalid response: ${validation.errors.join(', ')}');
      }

      // Parse transaction
      final transaction = response['transaction'] as Map<String, dynamic>;
      final previewId = response['preview_id'] as String;
      
      AILogger.logTransaction(transaction);

      await aiState.completeCommand(transaction, previewId);

    } catch (e) {
      final userFriendlyError = AIErrorHandler.handleError(e);
      await aiState.failCommand(userFriendlyError);
    }
  }

  Future<void> _approveTransaction() async {
    if (_userProfile == null) return;

    final aiState = Provider.of<AIStateProvider>(context, listen: false);
    final previewId = aiState.previewId;
    
    if (previewId == null) {
      _showError('No preview to approve');
      return;
    }

    await aiState.startApproval();

    try {
      final response = await _aiService.approveTransaction(
        previewId: previewId,
        userId: _userProfile!.uid,
        companyId: _userProfile!.companyId!,
      );

      AILogger.logResponse(200, response);

      // Get affected screens for refresh routing
      final transaction = aiState.currentPreview!;
      final affected = AITransactionRouter.getAffectedScreens(transaction);
      
      await aiState.completeApproval();

      // Show success with routing info
      final updateMessage = AITransactionRouter.getUpdateMessage(affected);
      _showSuccess(updateMessage);

      // TODO: Trigger actual screen refreshes via providers
      // Example: Provider.of<BankRegisterProvider>(context).refresh();

    } catch (e) {
      final userFriendlyError = AIErrorHandler.handleError(e);
      await aiState.failApproval(userFriendlyError);
    }
  }

  void _showError(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: Colors.red,
        duration: const Duration(seconds: 4),
      ),
    );
  }

  void _showSuccess(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: Colors.green,
        duration: const Duration(seconds: 3),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    if (!_isInitialized) {
      return Scaffold(
        appBar: AppBar(title: const Text('AI Assistant')),
        body: const Center(child: CircularProgressIndicator()),
      );
    }

    return Consumer<AIStateProvider>(
      builder: (context, aiState, child) {
        return Scaffold(
          appBar: AppBar(
            title: const Text('AI Accounting Assistant'),
            backgroundColor: const Color(0xFF1A237E),
          ),
          body: Column(
            children: [
              // Messages area
              Expanded(
                child: ListView(
                  controller: _scrollController,
                  padding: const EdgeInsets.all(16),
                  children: [
                    // Welcome message
                    _buildWelcomeCard(),
                    const SizedBox(height: 16),

                    // Last command
                    if (aiState.lastCommand != null) ...[
                      _buildUserMessage(aiState.lastCommand!),
                      const SizedBox(height: 16),
                    ],

                    // Loading state
                    if (aiState.isLoading) ...[
                      _buildLoadingCard(),
                      const SizedBox(height: 16),
                    ],

                    // Transaction preview
                    if (aiState.hasPreview && !aiState.isLoading) ...[
                      _buildTransactionPreview(aiState.currentPreview!),
                      const SizedBox(height: 16),
                    ],

                    // Error message
                    if (aiState.hasError && !aiState.isLoading) ...[
                      _buildErrorCard(aiState.errorMessage!),
                      const SizedBox(height: 16),
                    ],
                  ],
                ),
              ),

              // Input area
              _buildInputArea(aiState),
            ],
          ),
        );
      },
    );
  }

  Widget _buildWelcomeCard() {
    return Card(
      color: Colors.blue[50],
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: const [
                Icon(Icons.smart_toy, color: Colors.blue, size: 24),
                SizedBox(width: 8),
                Text(
                  'AI Accounting Assistant',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: Colors.blue,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            const Text(
              'Tell me about your transactions in plain language. Examples:',
              style: TextStyle(fontSize: 14),
            ),
            const SizedBox(height: 8),
            _buildExample('💰 "Add r650 income from consulting"'),
            _buildExample('💸 "Paid 500 for office supplies"'),
            _buildExample('🏢 "Purchase equipment for 10000"'),
          ],
        ),
      ),
    );
  }

  Widget _buildExample(String text) {
    return Padding(
      padding: const EdgeInsets.only(left: 16, top: 4),
      child: Text(
        text,
        style: const TextStyle(
          fontSize: 13,
          fontStyle: FontStyle.italic,
          color: Colors.black54,
        ),
      ),
    );
  }

  Widget _buildUserMessage(String message) {
    return Align(
      alignment: Alignment.centerRight,
      child: Container(
        constraints: BoxConstraints(
          maxWidth: MediaQuery.of(context).size.width * 0.75,
        ),
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: const Color(0xFF1A237E),
          borderRadius: BorderRadius.circular(12),
        ),
        child: Text(
          message,
          style: const TextStyle(color: Colors.white, fontSize: 15),
        ),
      ),
    );
  }

  Widget _buildLoadingCard() {
    return const Card(
      child: Padding(
        padding: EdgeInsets.all(16),
        child: Row(
          children: [
            SizedBox(
              width: 20,
              height: 20,
              child: CircularProgressIndicator(strokeWidth: 2),
            ),
            SizedBox(width: 12),
            Text('Processing your command...', style: TextStyle(fontSize: 14)),
          ],
        ),
      ),
    );
  }

  Widget _buildTransactionPreview(Map<String, dynamic> transaction) {
    final summary = AIParser.summarizeTransaction(transaction);

    return Card(
      elevation: 4,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header
            Row(
              children: [
                Text(summary.typeIcon, style: const TextStyle(fontSize: 24)),
                const SizedBox(width: 8),
                Text(
                  'Transaction Preview',
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
            const Divider(),

            // Transaction details
            _buildDetailRow('Type', summary.type.toUpperCase()),
            _buildDetailRow('Amount', summary.formattedAmount),
            _buildDetailRow('Description', summary.description),
            _buildDetailRow('Date', summary.date),

            const SizedBox(height: 12),
            const Text(
              'Journal Entries:',
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
            ),
            const SizedBox(height: 8),

            // Journal lines
            ...summary.journalLines.map((line) => _buildJournalLine(line)),

            const SizedBox(height: 16),

            // Approve button
            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                onPressed: Provider.of<AIStateProvider>(context).isApproving
                    ? null
                    : _approveTransaction,
                icon: Provider.of<AIStateProvider>(context).isApproving
                    ? const SizedBox(
                        width: 16,
                        height: 16,
                        child: CircularProgressIndicator(
                          strokeWidth: 2,
                          color: Colors.white,
                        ),
                      )
                    : const Icon(Icons.check_circle),
                label: Text(
                  Provider.of<AIStateProvider>(context).isApproving
                      ? 'Approving...'
                      : 'Approve & Post Transaction',
                ),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.green,
                  padding: const EdgeInsets.symmetric(vertical: 14),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDetailRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 100,
            child: Text(
              '$label:',
              style: const TextStyle(
                fontWeight: FontWeight.w600,
                color: Colors.black87,
              ),
            ),
          ),
          Expanded(
            child: Text(
              value,
              style: const TextStyle(color: Colors.black87),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildJournalLine(JournalLineSummary line) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        children: [
          Container(
            width: 40,
            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
            decoration: BoxDecoration(
              color: line.isDebit ? Colors.blue[50] : Colors.green[50],
              borderRadius: BorderRadius.circular(4),
            ),
            child: Text(
              line.isDebit ? 'DR' : 'CR',
              style: TextStyle(
                fontSize: 11,
                fontWeight: FontWeight.bold,
                color: line.isDebit ? Colors.blue[900] : Colors.green[900],
              ),
              textAlign: TextAlign.center,
            ),
          ),
          const SizedBox(width: 8),
          Expanded(
            child: Text(
              line.account,
              style: const TextStyle(fontSize: 14),
            ),
          ),
          Text(
            line.amount.toStringAsFixed(2),
            style: const TextStyle(
              fontWeight: FontWeight.w600,
              fontSize: 14,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildErrorCard(String error) {
    return Card(
      color: Colors.red[50],
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Row(
          children: [
            const Icon(Icons.error_outline, color: Colors.red, size: 24),
            const SizedBox(width: 12),
            Expanded(
              child: Text(
                error,
                style: const TextStyle(color: Colors.red, fontSize: 14),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildInputArea(AIStateProvider aiState) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: 4,
            offset: const Offset(0, -2),
          ),
        ],
      ),
      child: SafeArea(
        child: Row(
          children: [
            Expanded(
              child: TextField(
                controller: _messageController,
                decoration: InputDecoration(
                  hintText: 'Type your command... e.g., "r650 income from sales"',
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(24),
                  ),
                  contentPadding: const EdgeInsets.symmetric(
                    horizontal: 16,
                    vertical: 12,
                  ),
                ),
                enabled: !aiState.isBusy,
                maxLines: null,
                textInputAction: TextInputAction.send,
                onSubmitted: (_) => _sendCommand(),
              ),
            ),
            const SizedBox(width: 8),
            FloatingActionButton(
              onPressed: aiState.isBusy ? null : _sendCommand,
              backgroundColor: aiState.isBusy ? Colors.grey : const Color(0xFF1A237E),
              child: aiState.isLoading
                  ? const SizedBox(
                      width: 24,
                      height: 24,
                      child: CircularProgressIndicator(
                        strokeWidth: 2,
                        color: Colors.white,
                      ),
                    )
                  : const Icon(Icons.send),
            ),
          ],
        ),
      ),
    );
  }
}
