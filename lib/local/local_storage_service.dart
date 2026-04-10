// ...existing code...
  Future<void> saveAuditLog(Map<String, dynamic> map) async {
    final db = await database;
    await db.insert('audit_logs', map);
  }

  // --- Sync helper methods (compatibility stubs) ---
  // These methods are intentionally no-ops while full sync is deferred.
  Future<List<Map<String, dynamic>>> getPendingSync(String table) async {
    return [];
  }

  Future<void> markSynced(String table, String id) async {
    return;
  }

// ...existing code...
