import 'package:flutter/foundation.dart';

/// Global state management for AI assistant
/// Manages command state, preview data, and loading state
class AIStateProvider extends ChangeNotifier {
  // Loading state
  bool _isLoading = false;
  bool _isApproving = false;

  // Command state
  String? _lastCommand;
  DateTime? _lastCommandTime;

  // Transaction preview state
  Map<String, dynamic>? _currentPreview;
  String? _previewId;
  
  // Error state
  String? _errorMessage;
  DateTime? _errorTime;

  // Response state
  Map<String, dynamic>? _lastResponse;

  // Getters
  bool get isLoading => _isLoading;
  bool get isApproving => _isApproving;
  bool get isBusy => _isLoading || _isApproving;
  
  String? get lastCommand => _lastCommand;
  DateTime? get lastCommandTime => _lastCommandTime;
  
  Map<String, dynamic>? get currentPreview => _currentPreview;
  String? get previewId => _previewId;
  bool get hasPreview => _currentPreview != null;
  
  String? get errorMessage => _errorMessage;
  DateTime? get errorTime => _errorTime;
  bool get hasError => _errorMessage != null;
  
  Map<String, dynamic>? get lastResponse => _lastResponse;

  // Setters
  void setLoading(bool loading) {
    _isLoading = loading;
    notifyListeners();
  }

  void setApproving(bool approving) {
    _isApproving = approving;
    notifyListeners();
  }

  void setCommand(String command) {
    _lastCommand = command;
    _lastCommandTime = DateTime.now();
    clearError(); // Clear previous errors
    notifyListeners();
  }

  void setPreview(Map<String, dynamic> preview, String previewId) {
    _currentPreview = preview;
    _previewId = previewId;
    clearError(); // Clear errors on successful preview
    notifyListeners();
  }

  void clearPreview() {
    _currentPreview = null;
    _previewId = null;
    notifyListeners();
  }

  void setError(String error) {
    _errorMessage = error;
    _errorTime = DateTime.now();
    _isLoading = false;
    _isApproving = false;
    notifyListeners();
  }

  void clearError() {
    _errorMessage = null;
    _errorTime = null;
    notifyListeners();
  }

  void setResponse(Map<String, dynamic> response) {
    _lastResponse = response;
    notifyListeners();
  }

  void reset() {
    _isLoading = false;
    _isApproving = false;
    _lastCommand = null;
    _lastCommandTime = null;
    _currentPreview = null;
    _previewId = null;
    _errorMessage = null;
    _errorTime = null;
    _lastResponse = null;
    notifyListeners();
  }

  /// Returns duration since last command
  Duration? get timeSinceLastCommand {
    if (_lastCommandTime == null) return null;
    return DateTime.now().difference(_lastCommandTime!);
  }

  /// Returns duration since last error
  Duration? get timeSinceError {
    if (_errorTime == null) return null;
    return DateTime.now().difference(_errorTime!);
  }

  /// Checks if error is recent (within last 5 seconds)
  bool get hasRecentError {
    if (!hasError) return false;
    final duration = timeSinceError;
    return duration != null && duration.inSeconds < 5;
  }

  /// Full workflow: Send command → Preview → Approve
  Future<void> startCommand(String command) async {
    setCommand(command);
    setLoading(true);
    clearPreview();
  }

  Future<void> completeCommand(Map<String, dynamic> preview, String previewId) async {
    setPreview(preview, previewId);
    setLoading(false);
  }

  Future<void> failCommand(String error) async {
    setError(error);
    setLoading(false);
    clearPreview();
  }

  Future<void> startApproval() async {
    setApproving(true);
    clearError();
  }

  Future<void> completeApproval() async {
    setApproving(false);
    clearPreview();
  }

  Future<void> failApproval(String error) async {
    setError(error);
    setApproving(false);
  }
}
