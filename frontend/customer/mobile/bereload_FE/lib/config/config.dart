import 'package:flutter_dotenv/flutter_dotenv.dart';

class Config {
  static String get googleMapsApiKey {
    return dotenv.env['GOOGLE_MAPS_API_KEY'] ?? '';
  }
}
