import React, { useState } from "react";
import { FaCheck, FaSearch } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import ReactCountryFlag from "react-country-flag";

interface PlanDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  planName: string;
  gb: string;
  price: string;
  dataText: string;
  validityText: string;
  features: string[];
  isPopular?: boolean;
}

type CountryCode = "BE" | "FR" | "DE" | "IT" | "ES" | "NO" | "UA" | "LK" | "IN";

interface Country {
  code: CountryCode;
  name: string;
  isoCode: string;
}

const countries: Country[] = [
  { code: "BE", name: "Belgium", isoCode: "BE" },
  { code: "FR", name: "France", isoCode: "FR" },
  { code: "DE", name: "Germany", isoCode: "DE" },
  { code: "NO", name: "Norway", isoCode: "NO" },
  { code: "UA", name: "Ukraine", isoCode: "UA" },
  { code: "LK", name: "Sri Lanka", isoCode: "LK" },
  { code: "IN", name: "India", isoCode: "IN" },
];

const PlanDetailsModal: React.FC<PlanDetailsModalProps> = ({
  isOpen,
  onClose,
  planName,
  gb,
  price,
  dataText,
  validityText,
  features,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCountries = countries.filter((country) =>
    country.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full mx-4 md:mx-auto md:max-w-[800px] max-h-[80vh]">
        <button
          onClick={onClose}
          className="absolute -right-2 -top-10 md:-right-9 md:-top-5 text-gray-600 hover:text-gray-900 transition-colors bg-gray-100 rounded-full p-1 z-50"
          aria-label="Close modal"
        >
          <IoClose size={28} />
        </button>

        <div className="bg-white rounded-[20px] w-full max-h-[80vh] custom2-scrollbar overflow-y-auto">
          <div className="sticky top-0 bg-white rounded-t-2xl border-b border-gray-200 px-6 py-5 z-10">
            <div className="flex justify-between items-center">
              <h2 className="md:text-3xl text-2xl font-bold text-gray-900">
                Plan Details
              </h2>
              <div className="flex gap-4 items-center">
                {/* <button className="px-6 py-2 bg-[#05E27E] text-gray-900 font-medium rounded-lg hover:opacity-90 transition-opacity">
                  Get this plan
                </button> */}
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm font-semibold text-gray-500">
                  {planName}
                </p>
                <div className="flex justify-between items-end mt-3">
                  <span className="text-2xl font-bold text-gray-900">{gb}</span>
                  <span className="text-2xl font-bold text-gray-900">
                    {price}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-gray-600">{dataText}</span>
                  <span className="text-xs text-gray-600">{validityText}</span>
                </div>
              </div>

              <div className="h-px bg-gray-200" />

              <div className="space-y-2">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <FaCheck className="text-[#05E27E] w-4 h-4" />
                    <span className="text-gray-600">{feature}</span>
                  </div>
                ))}
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Things you need to know
                </h3>
                <p className="text-gray-500 mb-2">
                  Purchased online (via LycaMobile)
                </p>
                <ul className="space-y-2 text-gray-500">
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>
                      Data to use in Belgium or EU Roaming - 4GB New offline
                      customers with auto-renew will get 4GB instead of 2GB upon
                      bundle activation next cycle.
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>
                      Run out of data? Then automatically switch to our
                      competitive Pay as you Go rates.
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>
                      EU/EEA Roaming - For short holidays or business trips!
                      These roaming services are intended for customers staying
                      abroad for short periods.
                    </span>
                  </li>
                </ul>
              </div>

              <div className="h-px bg-gray-200" />

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Activation
                </h3>
                <p className="text-gray-500">
                  To activate your bundle, credit and promotions, you must first
                  register your new Lyca Mobile SIM Belgium
                </p>
              </div>

              <div className="h-px bg-gray-200" />

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Available Countries
                </h3>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search countries"
                    className="w-full px-4 py-2 pl-10 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#05E27E] focus:border-transparent transition-shadow"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <FaSearch className="absolute left-3 top-3 text-gray-400" />
                </div>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {filteredCountries.map((country, index) => (
                    <div key={index} className="flex items-center gap-3 p-2">
                      <div className="flex-shrink-0">
                        <ReactCountryFlag
                          countryCode={country.isoCode}
                          svg
                          style={{
                            borderRadius:"4px",
                            width: "24px",
                            height: "16px",
                          }}
                          title={country.name}
                        />
                      </div>
                      <span className="text-gray-700 font-medium">
                        {country.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="h-px bg-gray-200" />

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Order your bundle
                </h3>
                <p className="text-gray-500">
                  Text 2001 to 3535 to activate your bundle
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanDetailsModal;
