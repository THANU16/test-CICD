import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:geolocator/geolocator.dart';
import 'dart:math' show asin, cos, pi, pow, sin, sqrt;
import 'dart:ui' as ui;

class StoreHours {
  final String openTime;
  final String closeTime;
  final bool isClosed;

  StoreHours({
    required this.openTime,
    required this.closeTime,
    this.isClosed = false,
  });

  static StoreHours closed() {
    return StoreHours(openTime: '', closeTime: '', isClosed: true);
  }
}

class Store {
  final String id;
  final String name;
  final String address;
  final String phone;
  final String postalCode;
  final LatLng location;
  final Map<String, StoreHours> weeklyHours;
  double distance;

  Store({
    required this.id,
    required this.name,
    required this.address,
    required this.phone,
    required this.postalCode,
    required this.location,
    required this.weeklyHours,
    this.distance = 0.0,
  });
}

class FindStoreScreen extends StatefulWidget {
  const FindStoreScreen({super.key});

  @override
  State<FindStoreScreen> createState() => _FindStoreScreenState();
}

class _FindStoreScreenState extends State<FindStoreScreen> {
  late GoogleMapController _mapController;
  Store? _selectedStore;
  final Set<Marker> _markers = {};
  BitmapDescriptor? customIcon;
  final TextEditingController _searchController = TextEditingController();
  bool _showStoreList = true;
  bool _showSelectedStoreDetails = false;
  Position? _currentPosition;

  final List<Store> stores = [
    Store(
      id: '1',
      name: 'MILTA Retail - Lycamobile Authorized Seller',
      address: '123 Rue de la Loi, 1000 Brussels',
      phone: '+32 493444456',
      postalCode: '1000',
      location: const LatLng(50.8466, 4.3528),
      weeklyHours: {
        'Monday': StoreHours(openTime: '08:00', closeTime: '20:00'),
        'Tuesday': StoreHours(openTime: '08:00', closeTime: '20:00'),
        'Wednesday': StoreHours(openTime: '08:00', closeTime: '20:00'),
        'Thursday': StoreHours(openTime: '08:00', closeTime: '20:00'),
        'Friday': StoreHours(openTime: '08:00', closeTime: '20:00'),
        'Saturday': StoreHours.closed(),
        'Sunday': StoreHours.closed(),
      },
    ),
    Store(
      id: '2',
      name: 'Techiezone - Lycamobile Authorized Seller',
      address: '45 Meir, 2000 Londerzeel',
      phone: '+32 49456890',
      postalCode: '2020',
      location: const LatLng(51.0167, 4.3000),
      weeklyHours: {
        'Monday': StoreHours(openTime: '08:00', closeTime: '20:00'),
        'Tuesday': StoreHours(openTime: '08:00', closeTime: '20:00'),
        'Wednesday': StoreHours(openTime: '08:00', closeTime: '20:00'),
        'Thursday': StoreHours(openTime: '08:00', closeTime: '20:00'),
        'Friday': StoreHours(openTime: '08:00', closeTime: '20:00'),
        'Saturday': StoreHours.closed(),
        'Sunday': StoreHours.closed(),
      },
    ),
    Store(
      id: '3',
      name: 'Digital Hub - Lycamobile Authorized Seller',
      address: '45 Slagviverbeek, 2000 Lennik',
      phone: '+32 49456890',
      postalCode: '1090',
      location: const LatLng(50.8333, 4.1500),
      weeklyHours: {
        'Monday': StoreHours(openTime: '08:00', closeTime: '20:00'),
        'Tuesday': StoreHours(openTime: '08:00', closeTime: '20:00'),
        'Wednesday': StoreHours(openTime: '08:00', closeTime: '20:00'),
        'Thursday': StoreHours(openTime: '08:00', closeTime: '20:00'),
        'Friday': StoreHours(openTime: '08:00', closeTime: '20:00'),
        'Saturday': StoreHours.closed(),
        'Sunday': StoreHours.closed(),
      },
    ),
    Store(
      id: '4',
      name: 'Mobile Link - Lycamobile Authorized Seller',
      address: '78 Avenue de la Chasse, 1040 Etterbeek',
      phone: '+32 493567890',
      postalCode: '1040',
      location: const LatLng(50.8366, 4.3933),
      weeklyHours: {
        'Monday': StoreHours(openTime: '08:00', closeTime: '20:00'),
        'Tuesday': StoreHours(openTime: '08:00', closeTime: '20:00'),
        'Wednesday': StoreHours(openTime: '08:00', closeTime: '20:00'),
        'Thursday': StoreHours(openTime: '08:00', closeTime: '20:00'),
        'Friday': StoreHours(openTime: '08:00', closeTime: '20:00'),
        'Saturday': StoreHours.closed(),
        'Sunday': StoreHours.closed(),
      },
    ),
  ];

  Future<void> _launchDirections(LatLng location) async {
    final url = Uri.parse(
        'https://www.google.com/maps/dir/?api=1&destination=${location.latitude},${location.longitude}');
    if (await canLaunchUrl(url)) {
      await launchUrl(url, mode: LaunchMode.externalApplication);
    }
  }

  List<Store> get filteredStores {
    if (_searchController.text.isEmpty) return stores;
    return stores
        .where((store) => store.postalCode
            .toLowerCase()
            .contains(_searchController.text.toLowerCase()))
        .toList();
  }

  @override
  void initState() {
    super.initState();
    _getCurrentLocation();
    _updateMarkers();
  }

  Future<void> _getCurrentLocation() async {
    bool serviceEnabled;
    LocationPermission permission;

    serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) {
      return;
    }

    permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
      if (permission == LocationPermission.denied) {
        return;
      }
    }

    if (permission == LocationPermission.deniedForever) {
      return;
    }

    final position = await Geolocator.getCurrentPosition();
    setState(() {
      _currentPosition = position;
      _updateStoreDistances();
    });
  }

  void _updateStoreDistances() {
    if (_currentPosition == null) return;

    for (var store in stores) {
      final distance = Geolocator.distanceBetween(
        _currentPosition!.latitude,
        _currentPosition!.longitude,
        store.location.latitude,
        store.location.longitude,
      );

      store.distance = distance / 1000;
    }

    setState(() {});
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  void _onMarkerTapped(Store store) {
    setState(() {
      _selectedStore = store;
      _showStoreList = false;
      _showSelectedStoreDetails = true;
    });

    _updateMarkers();
    _mapController.animateCamera(
      CameraUpdate.newCameraPosition(
        CameraPosition(
          target: store.location,
          zoom: 12,
        ),
      ),
    );
  }

  Future<BitmapDescriptor> _createIcon(bool isSelected) async {
    final ByteData data = await rootBundle.load('images/maplogo.png');
    final ui.Codec codec = await ui.instantiateImageCodec(
      data.buffer.asUint8List(),
      targetWidth: isSelected ? 180 : 120,
      targetHeight: isSelected ? 180 : 120,
    );
    final ui.FrameInfo fi = await codec.getNextFrame();
    final data2 = await fi.image.toByteData(
      format: ui.ImageByteFormat.png,
    );

    if (data2 != null) {
      return BitmapDescriptor.fromBytes(data2.buffer.asUint8List());
    }
    return BitmapDescriptor.defaultMarker;
  }

  void _updateMarkers() async {
    _markers.clear();
    for (var store in stores) {
      final isSelected = store.id == _selectedStore?.id;
      final icon = await _createIcon(isSelected);

      setState(() {
        _markers.add(
          Marker(
            markerId: MarkerId(store.id),
            position: store.location,
            icon: icon,
            infoWindow: InfoWindow(title: store.name),
            onTap: () => _onMarkerTapped(store),
          ),
        );
      });
    }
  }

  void _showStoreDetails(Store store) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => _StoreDetailsSheet(store: store),
    );
  }

  Widget _buildStoreInfo(Store store) {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Align(
            alignment: Alignment.centerRight,
            child: GestureDetector(
              onTap: () {
                setState(() {
                  _showStoreList = true;
                  _showSelectedStoreDetails = false;
                });
              },
              child: Container(
                margin: const EdgeInsets.only(bottom: 12),
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: Colors.grey[300]!),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.1),
                      blurRadius: 4,
                      offset: const Offset(0, 2),
                    ),
                  ],
                ),
                child: Icon(
                  Icons.format_list_bulleted,
                  size: 24,
                  color: Colors.grey[700],
                ),
              ),
            ),
          ),
          Container(
            margin: const EdgeInsets.only(bottom: 20),
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: Colors.grey[300]!),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.1),
                  blurRadius: 10,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            child: Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        store.name,
                        style: GoogleFonts.inter(
                          fontSize: 16,
                          fontWeight: FontWeight.w500,
                          color: Colors.grey[900],
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        store.address,
                        style: GoogleFonts.inter(
                          fontSize: 14,
                          fontWeight: FontWeight.w500,
                          color: Colors.grey[500],
                        ),
                      ),
                    ],
                  ),
                ),
                GestureDetector(
                  onTap: () => _launchDirections(store.location),
                  child: FaIcon(
                    FontAwesomeIcons.diamondTurnRight,
                    color: Colors.blue[500],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: Stack(
        children: [
          GoogleMap(
            initialCameraPosition: const CameraPosition(
              target: LatLng(50.8503, 4.3517),
              zoom: 10,
            ),
            markers: _markers,
            onMapCreated: (controller) => _mapController = controller,
            myLocationEnabled: true,
            myLocationButtonEnabled: true,
          ),
          Positioned(
            top: MediaQuery.of(context).padding.top + 8,
            left: 16,
            child: Container(
              decoration: BoxDecoration(
                color: Colors.white.withAlpha(250),
                border: Border.all(
                  color: Colors.grey[300]!,
                  width: 1,
                ),
                borderRadius: BorderRadius.circular(12),
              ),
              child: IconButton(
                icon: const Icon(
                  Icons.chevron_left,
                  size: 30,
                ),
                padding: EdgeInsets.zero,
                color: Colors.black,
                onPressed: () => Navigator.pop(context),
              ),
            ),
          ),
          if (_showStoreList)
            Positioned(
              bottom: 0,
              left: 0,
              right: 0,
              child: Container(
                height: MediaQuery.of(context).size.height * 0.35,
                decoration: BoxDecoration(
                  color: Colors.white,
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.1),
                      blurRadius: 10,
                      offset: const Offset(0, -5),
                    ),
                  ],
                ),
                child: Column(
                  children: [
                    Padding(
                      padding: const EdgeInsets.all(16),
                      child: TextField(
                        controller: _searchController,
                        decoration: InputDecoration(
                          hintText: 'Enter postal code',
                          hintStyle: GoogleFonts.inter(
                            color: Colors.grey[400],
                            fontSize: 16,
                          ),
                          prefixIcon:
                              Icon(Icons.search, color: Colors.grey[400]),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(16),
                            borderSide: BorderSide(
                                color: const Color.fromARGB(255, 0, 0, 0)),
                          ),
                          enabledBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: BorderSide(color: Colors.grey[300]!),
                          ),
                          focusedBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: BorderSide(color: Colors.grey[400]!),
                          ),
                        ),
                        onChanged: (value) => setState(() {}),
                      ),
                    ),
                    Expanded(
                      child: ListView.builder(
                        padding: const EdgeInsets.symmetric(horizontal: 16),
                        itemCount: filteredStores.length,
                        itemBuilder: (context, index) {
                          final store = filteredStores[index];
                          return GestureDetector(
                            onTap: () => _showStoreDetails(store),
                            child: Container(
                              margin: const EdgeInsets.only(bottom: 12),
                              padding: const EdgeInsets.all(12),
                              decoration: BoxDecoration(
                                border: Border.all(color: Colors.grey[300]!),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: Row(
                                children: [
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment:
                                          CrossAxisAlignment.start,
                                      children: [
                                        Text(
                                          store.name,
                                          style: GoogleFonts.inter(
                                            fontSize: 16,
                                            fontWeight: FontWeight.w500,
                                            color: Colors.grey[900],
                                          ),
                                        ),
                                        const SizedBox(height: 4),
                                        Text(
                                          store.address,
                                          style: GoogleFonts.inter(
                                            fontSize: 14,
                                            fontWeight: FontWeight.w500,
                                            color: Colors.grey[500],
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                  GestureDetector(
                                    onTap: () =>
                                        _launchDirections(store.location),
                                    child: FaIcon(
                                      FontAwesomeIcons.diamondTurnRight,
                                      color: Colors.blue[500],
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          );
                        },
                      ),
                    ),
                  ],
                ),
              ),
            ),
          if (_showSelectedStoreDetails && _selectedStore != null)
            Positioned(
              bottom: 0,
              left: 0,
              right: 0,
              child: _buildStoreInfo(_selectedStore!),
            ),
        ],
      ),
    );
  }
}

class _StoreDetailsSheet extends StatelessWidget {
  final Store store;

  const _StoreDetailsSheet({required this.store});

  List<Widget> _buildHoursList() {
    final days = [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday'
    ];
    return days.map((day) {
      final hours = store.weeklyHours[day]!;
      return Padding(
        padding: const EdgeInsets.symmetric(vertical: 5),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              day,
              style: GoogleFonts.inter(
                fontSize: 16,
                fontWeight: FontWeight.w500,
                color: Colors.grey[700],
              ),
            ),
            Text(
              hours.isClosed
                  ? 'Closed'
                  : '${hours.openTime} - ${hours.closeTime}',
              style: GoogleFonts.inter(
                fontSize: 16,
                fontWeight: FontWeight.w500,
                color: hours.isClosed ? Colors.red[500] : Colors.grey[700],
              ),
            ),
          ],
        ),
      );
    }).toList();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(32)),
      ),
      padding: const EdgeInsets.all(20),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Spacer(),
              Text(
                'Shop details',
                style: GoogleFonts.inter(
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                  color: Colors.grey[900],
                ),
              ),
              const Spacer(),
              GestureDetector(
                onTap: () => Navigator.pop(context),
                child: Icon(
                  Icons.close,
                  size: 24,
                  color: Colors.grey[800],
                ),
              ),
            ],
          ),
          Divider(color: Colors.grey[300], height: 30),
          Text(
            store.name,
            style: GoogleFonts.inter(
              fontSize: 18,
              fontWeight: FontWeight.w600,
              color: Colors.grey[900],
            ),
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              FaIcon(
                FontAwesomeIcons.locationDot,
                size: 22,
                color: Colors.grey[600],
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Text(
                  store.address,
                  style: GoogleFonts.inter(
                    fontSize: 16,
                    fontWeight: FontWeight.w500,
                    color: Colors.grey[700],
                  ),
                ),
              ),
              Text(
                '${store.distance.toStringAsFixed(1)}km',
                style: GoogleFonts.inter(
                  fontSize: 16,
                  fontWeight: FontWeight.w700,
                  color: Colors.grey[900],
                ),
              ),
            ],
          ),
          Divider(color: Colors.grey[300], height: 40),
          Text(
            'Opening hours',
            style: GoogleFonts.inter(
              fontSize: 16,
              fontWeight: FontWeight.w700,
              color: Colors.grey[900],
            ),
          ),
          const SizedBox(height: 12),
          ..._buildHoursList(),
          Divider(color: Colors.grey[300], height: 30),
          Text(
            'Contact',
            style: GoogleFonts.inter(
              fontSize: 16,
              fontWeight: FontWeight.w700,
              color: Colors.grey[900],
            ),
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              FaIcon(
                FontAwesomeIcons.phone,
                size: 22,
                color: Colors.grey[600],
              ),
              const SizedBox(width: 12),
              Text(
                store.phone,
                style: GoogleFonts.inter(
                  fontSize: 16,
                  fontWeight: FontWeight.w500,
                  color: Colors.grey[700],
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: () async {
                final url = Uri.parse(
                    'https://www.google.com/maps/dir/?api=1&destination=${store.location.latitude},${store.location.longitude}');
                if (await canLaunchUrl(url)) {
                  await launchUrl(url, mode: LaunchMode.externalApplication);
                }
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF05E27E),
                padding: const EdgeInsets.symmetric(vertical: 16),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              child: Text(
                'Get Directions now',
                style: GoogleFonts.inter(
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                  color: Colors.black,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
