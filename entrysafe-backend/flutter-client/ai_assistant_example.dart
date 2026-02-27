import 'package:flutter/material.dart';
import 'entry_safe_ai_service.dart';

/// Example Flutter widget showing how to use the AI service
/// 
/// This can be used in Entry Safe Accounting, Docs, or Pricing apps
class AIAssistantExample extends StatefulWidget {
  final String appType; // "accounting", "docs", or "pricing"

  const AIAssistantExample({
    Key? key,
    required this.appType,
  }) : super(key: key);

  @override
  State<AIAssistantExample> createState() => _AIAssistantExampleState();
}

class _AIAssistantExampleState extends State<AIAssistantExample> {
  final TextEditingController _promptController = TextEditingController();
  String _response = '';
  bool _isLoading = false;
  String? _error;

  Future<void> _generateResponse() async {
    final prompt = _promptController.text.trim();
    
    if (prompt.isEmpty) {
      setState(() {
        _error = 'Please enter a prompt';
      });
      return;
    }

    setState(() {
      _isLoading = true;
      _error = null;
      _response = '';
    });

    try {
      AIResponse response;
      
      // Call the appropriate endpoint based on app type
      switch (widget.appType) {
        case 'accounting':
          response = await EntrySafeAIService.generateAccountingResponse(prompt);
          break;
        case 'docs':
          response = await EntrySafeAIService.generateDocsResponse(prompt);
          break;
        case 'pricing':
          response = await EntrySafeAIService.generatePricingResponse(prompt);
          break;
        default:
          throw Exception('Invalid app type');
      }

      setState(() {
        _response = response.result;
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _error = e.toString();
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('AI Assistant - ${widget.appType.toUpperCase()}'),
        backgroundColor: const Color(0xFF1A237E), // Navy
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Prompt input
            TextField(
              controller: _promptController,
              maxLines: 3,
              decoration: InputDecoration(
                labelText: 'Ask AI Assistant',
                hintText: _getHintText(),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                filled: true,
                fillColor: Colors.grey[100],
              ),
            ),
            const SizedBox(height: 16),

            // Generate button
            ElevatedButton.icon(
              onPressed: _isLoading ? null : _generateResponse,
              icon: _isLoading
                  ? const SizedBox(
                      width: 20,
                      height: 20,
                      child: CircularProgressIndicator(
                        strokeWidth: 2,
                        color: Colors.white,
                      ),
                    )
                  : const Icon(Icons.auto_awesome),
              label: Text(_isLoading ? 'Generating...' : 'Generate Response'),
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF1A237E), // Navy
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 16),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
            ),
            const SizedBox(height: 24),

            // Error message
            if (_error != null)
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.red[50],
                  border: Border.all(color: Colors.red),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  _error!,
                  style: const TextStyle(color: Colors.red),
                ),
              ),

            // Response display
            if (_response.isNotEmpty)
              Expanded(
                child: Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    border: Border.all(color: const Color(0xFFD4AF37)), // Gold
                    borderRadius: BorderRadius.circular(12),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.grey.withOpacity(0.2),
                        spreadRadius: 2,
                        blurRadius: 5,
                      ),
                    ],
                  ),
                  child: SingleChildScrollView(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Icon(
                              Icons.auto_awesome,
                              color: const Color(0xFFD4AF37), // Gold
                            ),
                            const SizedBox(width: 8),
                            const Text(
                              'AI Response',
                              style: TextStyle(
                                fontWeight: FontWeight.bold,
                                fontSize: 16,
                              ),
                            ),
                          ],
                        ),
                        const Divider(),
                        Text(
                          _response,
                          style: const TextStyle(fontSize: 15, height: 1.5),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }

  String _getHintText() {
    switch (widget.appType) {
      case 'accounting':
        return 'e.g., "Analyze my monthly expenses" or "Generate invoice for web services"';
      case 'docs':
        return 'e.g., "Summarize this document" or "Suggest tags for this file"';
      case 'pricing':
        return 'e.g., "Suggest pricing for consulting service" or "Calculate profit margin"';
      default:
        return 'Ask me anything...';
    }
  }

  @override
  void dispose() {
    _promptController.dispose();
    super.dispose();
  }
}

/// Example usage in your main app:
/// 
/// // For Entry Safe Accounting App
/// Navigator.push(
///   context,
///   MaterialPageRoute(
///     builder: (context) => const AIAssistantExample(appType: 'accounting'),
///   ),
/// );
/// 
/// // For Entry Safe Docs App
/// Navigator.push(
///   context,
///   MaterialPageRoute(
///     builder: (context) => const AIAssistantExample(appType: 'docs'),
///   ),
/// );
/// 
/// // For Entry Safe Pricing App
/// Navigator.push(
///   context,
///   MaterialPageRoute(
///     builder: (context) => const AIAssistantExample(appType: 'pricing'),
///   ),
/// );
