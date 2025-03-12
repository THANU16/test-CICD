class SimSwapService {
  static final SimSwapService _instance = SimSwapService._internal();
  factory SimSwapService() => _instance;
  SimSwapService._internal();

  final List<Map<String, String>> requests = [
    {
      'date': '25 Jan 2025',
      'status': 'Completed',
      'oldNumber': '+32493454910',
      'newNumber': '+32494590891',
      'reason': 'Network issue',
    }
  ];

  void addRequest(Map<String, String> request) {
    requests.insert(0, request);
  }
}
