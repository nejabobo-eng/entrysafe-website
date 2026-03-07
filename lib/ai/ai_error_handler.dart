import 'dart:io';

/// Centralized error handling for AI operations
class AIErrorHandler {
  
  /// Convert exceptions to user-friendly error messages
  static String handleError(dynamic error) {
    final errorStr = error.toString();

    // Network errors
    if (error is SocketException) {
      return 'Network error. Please check your internet connection.';
    }

    if (errorStr.contains('timed out')) {
      return 'Request timed out. The AI is taking too long to respond. Please try again.';
    }

    // Authentication errors
    if (errorStr.contains('Authentication failed') || errorStr.contains('401')) {
      return 'Session expired. Please log in again.';
    }

    if (errorStr.contains('403')) {
      return 'Access denied. Please check your subscription status.';
    }

    // Company/Setup errors
    if (errorStr.contains('Company not found')) {
      return 'Company setup incomplete. Please check Settings.';
    }

    if (errorStr.contains('complete signup')) {
      return 'Please complete your account setup in Settings.';
    }

    // AI parsing errors
    if (errorStr.contains('Failed to parse')) {
      return 'AI could not understand your command. Try: "Add 500 rand income from sales"';
    }

    if (errorStr.contains('Missing required field')) {
      return 'Transaction incomplete. Please include amount and description.';
    }

    if (errorStr.contains('not balanced')) {
      return 'Transaction error: Debits and credits don\'t match. Please contact support.';
    }

    // OpenAI API errors
    if (errorStr.contains('OpenAI') || errorStr.contains('API key')) {
      return 'AI service temporarily unavailable. Please try again in a moment.';
    }

    if (errorStr.contains('rate limit') || errorStr.contains('quota')) {
      return 'AI usage limit reached. Please upgrade your plan or try again later.';
    }

    // Generic server errors
    if (errorStr.contains('500') || errorStr.contains('Internal Server Error')) {
      return 'Server error. Our team has been notified. Please try again.';
    }

    if (errorStr.contains('502') || errorStr.contains('503') || errorStr.contains('504')) {
      return 'Server temporarily unavailable. Please try again in a moment.';
    }

    // Default: Return cleaned error message
    String cleanMsg = errorStr
        .replaceAll('Exception: ', '')
        .replaceAll('Error: ', '')
        .trim();
    
    return cleanMsg.isEmpty ? 'An unexpected error occurred' : cleanMsg;
  }

  /// Check if error is retryable
  static bool isRetryable(dynamic error) {
    final errorStr = error.toString().toLowerCase();
    
    // Retryable errors
    return errorStr.contains('timeout') ||
        errorStr.contains('network') ||
        errorStr.contains('connection') ||
        errorStr.contains('502') ||
        errorStr.contains('503') ||
        errorStr.contains('504');
  }

  /// Check if error requires re-authentication
  static bool requiresReauth(dynamic error) {
    final errorStr = error.toString().toLowerCase();
    return errorStr.contains('401') ||
        errorStr.contains('authentication failed') ||
        errorStr.contains('session expired');
  }

  /// Check if error is due to subscription limits
  static bool isSubscriptionError(dynamic error) {
    final errorStr = error.toString().toLowerCase();
    return errorStr.contains('rate limit') ||
        errorStr.contains('quota') ||
        errorStr.contains('usage limit') ||
        errorStr.contains('subscription') ||
        errorStr.contains('upgrade');
  }
}
