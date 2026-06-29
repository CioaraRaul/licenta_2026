import { useState, useCallback, useRef } from "react";
import { Link, useNavigate } from "react-router";
import { createVehicle } from "~/api/vehicles.api";
import { uploadImages, deleteImage } from "~/api/upload.api";
import type { CreateVehiclePayload } from "~/interface/vehicle.interface";
import {
  VEHICLE_TYPE_OPTIONS,
  CONDITION_OPTIONS,
  FUEL_TYPE_OPTIONS,
  TRANSMISSION_OPTIONS,
  EXTERIOR_COLOR_OPTIONS,
} from "~/constants/findVehicle.constants";
import {
  STEPS,
  DRIVE_TYPE_OPTIONS,
  COMMON_FEATURES,
  COMMON_SAFETY_FEATURES,
  MAX_IMAGES,
  DEFAULT_FORM,
  type NewListingForm,
} from "~/constants/newListing.constants";
import { Input, Select, Toggle } from "./newListing/FormFields";

// ─── Component ────────────────────────────────────────────────────────────────

export default function NewListingComponent() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Form state ──────────────────────────────────────────────────────────
  const [form, setForm] = useState<NewListingForm>(DEFAULT_FORM);

  const [features, setFeatures] = useState<string[]>([]);
  const [safetyFeatures, setSafetyFeatures] = useState<string[]>([]);
  const [customFeature, setCustomFeature] = useState("");
  const [customSafetyFeature, setCustomSafetyFeature] = useState("");

  // Image state — stores uploaded URLs & public IDs
  const [images, setImages] = useState<
    Array<{ url: string; publicId: string }>
  >([]);

  // ── Helpers ─────────────────────────────────────────────────────────────

  const updateField = useCallback(
    <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const toggleFeature = (list: string[], setList: (v: string[]) => void, f: string) => {
    setList(list.includes(f) ? list.filter((x) => x !== f) : [...list, f]);
  };

  const addCustomFeature = (
    value: string,
    list: string[],
    setList: (v: string[]) => void,
    clearInput: () => void,
  ) => {
    const trimmed = value.trim();
    if (trimmed && !list.includes(trimmed)) {
      setList([...list, trimmed]);
    }
    clearInput();
  };

  // ── Image upload ────────────────────────────────────────────────────────

  const handleImageUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    if (images.length + files.length > MAX_IMAGES) {
      setError(`Maximum ${MAX_IMAGES} images allowed.`);
      return;
    }

    setUploading(true);
    setError(null);
    try {
      const result = await uploadImages(Array.from(files));
      setImages((prev) => [
        ...prev,
        ...result.images.map((img) => ({
          url: img.url,
          publicId: img.publicId,
        })),
      ]);
    } catch {
      setError("Failed to upload images. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = async (publicId: string) => {
    try {
      await deleteImage(publicId);
      setImages((prev) => prev.filter((img) => img.publicId !== publicId));
    } catch {
      setError("Failed to remove image.");
    }
  };

  // ── Submit ──────────────────────────────────────────────────────────────

  const handleSubmit = async () => {
    setError(null);

    // Basic validation
    if (!form.make || !form.model || !form.vin) {
      setError("Make, model, and VIN are required.");
      return;
    }
    if (form.price <= 0) {
      setError("Price must be greater than 0.");
      return;
    }
    if (images.length === 0) {
      setError("Please upload at least one image.");
      return;
    }

    if (form.vin.length !== 17) {
      setError("VIN must be exactly 17 characters.");
      return;
    }
    if (form.description.length < 10) {
      setError("Description must be at least 10 characters.");
      return;
    }

    setSubmitting(true);
    try {
      const payload: CreateVehiclePayload = {
        make: form.make,
        model: form.model,
        year: form.year,
        type: form.type,
        condition: form.condition,
        trim: form.trim || undefined,
        price: form.price,
        originalPrice: form.originalPrice || undefined,
        negotiable: form.negotiable,
        mileage: form.mileage,
        city: form.city,
        country: form.country,
        zipCode: form.zipCode || undefined,
        engineSize: form.engineSize,
        engineType: form.engineType || undefined,
        horsepower: form.horsepower || undefined,
        torque: form.torque || undefined,
        fuelType: form.fuelType,
        transmission: form.transmission,
        driveType: form.driveType,
        exteriorColor: form.exteriorColor,
        interiorColor: form.interiorColor || undefined,
        doors: form.doors,
        seats: form.seats,
        vin: form.vin,
        licensePlate: form.licensePlate || undefined,
        features,
        safetyFeatures,
        description: form.description,
        images: images.map((img) => img.url),
        previousOwners: form.previousOwners || undefined,
        accidentHistory: form.accidentHistory,
        serviceHistory: form.serviceHistory || undefined,
        warrantyAvailable: form.warrantyAvailable,
      };
      await createVehicle(payload);
      navigate("/my-listings");
    } catch (err) {
      if (err instanceof Error && "data" in err) {
        const data = (err as { data?: { message?: string | string[] } }).data;
        const msg = Array.isArray(data?.message)
          ? data.message.join(", ")
          : data?.message;
        setError(msg || "Failed to create listing. Please try again.");
      } else {
        setError("Failed to create listing. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  // ── Stepper navigation ──────────────────────────────────────────────────

  const canProceed = () => {
    switch (step) {
      case 0:
        return Boolean(form.make && form.model && form.year && form.vin && form.vin.length === 17);
      case 1:
        return Boolean(form.city && form.country && form.engineSize > 0 && form.description.length >= 10);
      case 2:
        return true;
      case 3:
        return images.length > 0;
      case 4:
        return form.price > 0;
      default:
        return true;
    }
  };

  // ── Step content ────────────────────────────────────────────────────────

  const renderStep = () => {
    switch (step) {
      // Step 0 — Basic Info
      case 0:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Input
                label="Make"
                value={form.make}
                onChange={(v) => updateField("make", v)}
                placeholder="ex: Toyota"
                required
              />
              <Input
                label="Model"
                value={form.model}
                onChange={(v) => updateField("model", v)}
                placeholder="ex: Camry"
                required
              />
              <Input
                label="Year"
                value={form.year || ""}
                onChange={(v) => updateField("year", parseInt(v) || 0)}
                type="number"
                placeholder="ex: 2022"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Select
                label="Vehicle Type"
                value={form.type}
                onChange={(v) => updateField("type", v as typeof form.type)}
                options={[...VEHICLE_TYPE_OPTIONS]}
                required
              />
              <Select
                label="Condition"
                value={form.condition}
                onChange={(v) => updateField("condition", v as typeof form.condition)}
                options={[...CONDITION_OPTIONS]}
                required
              />
              <Input
                label="Trim"
                value={form.trim}
                onChange={(v) => updateField("trim", v)}
                placeholder="ex: SE, XLE, Limited"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="VIN"
                value={form.vin}
                onChange={(v) => updateField("vin", v)}
                placeholder="ex: 1HGBH41JXMN109186"
                required
              />
              <Input
                label="License Plate"
                value={form.licensePlate}
                onChange={(v) => updateField("licensePlate", v)}
                placeholder="ex: B-123-ABC"
              />
            </div>
          </div>
        );

      // Step 1 — Details
      case 1:
        return (
          <div className="space-y-6">
            {/* Engine & Performance */}
            <div>
              <h3 className="text-[13px] font-semibold text-[#f5f5f7] mb-3">
                Engine & Performance
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Input
                  label="Engine Size (L)"
                  value={form.engineSize || ""}
                  onChange={(v) => updateField("engineSize", parseFloat(v) || 0)}
                  type="number"
                  placeholder="ex: 2.5"
                  required
                />
                <Input
                  label="Engine Type"
                  value={form.engineType}
                  onChange={(v) => updateField("engineType", v)}
                  placeholder="ex: Inline-4, V6"
                />
                <Input
                  label="Horsepower"
                  value={form.horsepower || ""}
                  onChange={(v) => updateField("horsepower", parseInt(v) || 0)}
                  type="number"
                  placeholder="ex: 203"
                />
                <Input
                  label="Torque (lb-ft)"
                  value={form.torque || ""}
                  onChange={(v) => updateField("torque", parseInt(v) || 0)}
                  type="number"
                  placeholder="ex: 184"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Select
                label="Fuel Type"
                value={form.fuelType}
                onChange={(v) => updateField("fuelType", v as typeof form.fuelType)}
                options={[...FUEL_TYPE_OPTIONS]}
                required
              />
              <Select
                label="Transmission"
                value={form.transmission}
                onChange={(v) => updateField("transmission", v as typeof form.transmission)}
                options={[...TRANSMISSION_OPTIONS]}
                required
              />
              <Select
                label="Drive Type"
                value={form.driveType}
                onChange={(v) => updateField("driveType", v as typeof form.driveType)}
                options={[...DRIVE_TYPE_OPTIONS]}
                required
              />
            </div>

            {/* Exterior */}
            <div>
              <h3 className="text-[13px] font-semibold text-[#f5f5f7] mb-3">
                Appearance
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Select
                  label="Exterior Color"
                  value={form.exteriorColor}
                  onChange={(v) => updateField("exteriorColor", v)}
                  options={[...EXTERIOR_COLOR_OPTIONS]}
                  required
                />
                <Input
                  label="Interior Color"
                  value={form.interiorColor}
                  onChange={(v) => updateField("interiorColor", v)}
                  placeholder="ex: Black leather"
                />
                <Input
                  label="Doors"
                  value={form.doors || ""}
                  onChange={(v) => updateField("doors", parseInt(v) || 0)}
                  type="number"
                  placeholder="ex: 4"
                />
                <Input
                  label="Seats"
                  value={form.seats || ""}
                  onChange={(v) => updateField("seats", parseInt(v) || 0)}
                  type="number"
                  placeholder="ex: 5"
                />
              </div>
            </div>

            {/* Location & Mileage */}
            <div>
              <h3 className="text-[13px] font-semibold text-[#f5f5f7] mb-3">
                Location & Mileage
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Input
                  label="City"
                  value={form.city}
                  onChange={(v) => updateField("city", v)}
                  placeholder="ex: Los Angeles"
                  required
                />
                <Input
                  label="Country"
                  value={form.country}
                  onChange={(v) => updateField("country", v)}
                  placeholder="ex: United States"
                  required
                />
                <Input
                  label="ZIP Code"
                  value={form.zipCode}
                  onChange={(v) => updateField("zipCode", v)}
                  placeholder="ex: 90001"
                />
                <Input
                  label="Mileage"
                  value={form.mileage || ""}
                  onChange={(v) => updateField("mileage", parseInt(v) || 0)}
                  type="number"
                  placeholder="ex: 35000"
                  required
                />
              </div>
            </div>

            {/* History */}
            <div>
              <h3 className="text-[13px] font-semibold text-[#f5f5f7] mb-3">
                Vehicle History
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Previous Owners"
                  value={form.previousOwners || ""}
                  onChange={(v) => updateField("previousOwners", parseInt(v) || 0)}
                  type="number"
                  placeholder="ex: 1"
                />
                <Input
                  label="Service History"
                  value={form.serviceHistory}
                  onChange={(v) => updateField("serviceHistory", v)}
                  placeholder="ex: Full dealer service history"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <Toggle
                  label="Accident History"
                  checked={form.accidentHistory}
                  onChange={(v) => updateField("accidentHistory", v)}
                />
                <Toggle
                  label="Warranty Available"
                  checked={form.warrantyAvailable}
                  onChange={(v) => updateField("warrantyAvailable", v)}
                />
              </div>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-medium text-[#8e8e9a] uppercase tracking-wider">
                Description <span className="text-[#e63946] ml-0.5">*</span>
              </label>
              <textarea
                rows={4}
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
                placeholder="Describe your vehicle — condition, history, standout features…"
                className="w-full px-3.5 py-2.5 bg-white/[0.04] border border-white/[0.06] rounded-lg text-[13px] text-[#f5f5f7] placeholder-[#555] focus:outline-none focus:border-[#e63946]/40 transition-colors resize-none"
              />
            </div>
          </div>
        );

      // Step 2 — Features
      case 2:
        return (
          <div className="space-y-6">
            {/* Features */}
            <div>
              <h3 className="text-[13px] font-semibold text-[#f5f5f7] mb-3">
                Features
              </h3>
              <div className="flex flex-wrap gap-2">
                {COMMON_FEATURES.map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => toggleFeature(features, setFeatures, f)}
                    className={`px-3 py-1.5 rounded-lg text-[12px] font-medium border transition-colors ${
                      features.includes(f)
                        ? "bg-[#e63946]/10 text-[#e63946] border-[#e63946]/20"
                        : "bg-white/[0.04] text-[#8e8e9a] border-white/[0.06] hover:border-white/[0.1]"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
              <div className="flex gap-2 mt-3">
                <input
                  type="text"
                  value={customFeature}
                  onChange={(e) => setCustomFeature(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addCustomFeature(customFeature, features, setFeatures, () =>
                        setCustomFeature(""),
                      );
                    }
                  }}
                  placeholder="Add custom feature…"
                  className="flex-1 px-3.5 py-2 bg-white/[0.04] border border-white/[0.06] rounded-lg text-[13px] text-[#f5f5f7] placeholder-[#555] focus:outline-none focus:border-[#e63946]/40 transition-colors"
                />
                <button
                  type="button"
                  onClick={() =>
                    addCustomFeature(customFeature, features, setFeatures, () =>
                      setCustomFeature(""),
                    )
                  }
                  className="px-4 py-2 bg-white/[0.06] border border-white/[0.06] rounded-lg text-[13px] text-[#f5f5f7] font-medium hover:bg-white/[0.08] transition-colors"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Safety Features */}
            <div>
              <h3 className="text-[13px] font-semibold text-[#f5f5f7] mb-3">
                Safety Features
              </h3>
              <div className="flex flex-wrap gap-2">
                {COMMON_SAFETY_FEATURES.map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => toggleFeature(safetyFeatures, setSafetyFeatures, f)}
                    className={`px-3 py-1.5 rounded-lg text-[12px] font-medium border transition-colors ${
                      safetyFeatures.includes(f)
                        ? "bg-[#10b981]/10 text-[#10b981] border-[#10b981]/20"
                        : "bg-white/[0.04] text-[#8e8e9a] border-white/[0.06] hover:border-white/[0.1]"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
              <div className="flex gap-2 mt-3">
                <input
                  type="text"
                  value={customSafetyFeature}
                  onChange={(e) => setCustomSafetyFeature(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addCustomFeature(
                        customSafetyFeature,
                        safetyFeatures,
                        setSafetyFeatures,
                        () => setCustomSafetyFeature(""),
                      );
                    }
                  }}
                  placeholder="Add custom safety feature…"
                  className="flex-1 px-3.5 py-2 bg-white/[0.04] border border-white/[0.06] rounded-lg text-[13px] text-[#f5f5f7] placeholder-[#555] focus:outline-none focus:border-[#e63946]/40 transition-colors"
                />
                <button
                  type="button"
                  onClick={() =>
                    addCustomFeature(
                      customSafetyFeature,
                      safetyFeatures,
                      setSafetyFeatures,
                      () => setCustomSafetyFeature(""),
                    )
                  }
                  className="px-4 py-2 bg-white/[0.06] border border-white/[0.06] rounded-lg text-[13px] text-[#f5f5f7] font-medium hover:bg-white/[0.08] transition-colors"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Selected summary */}
            {(features.length > 0 || safetyFeatures.length > 0) && (
              <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-4">
                <p className="text-[11px] font-semibold text-[#8e8e9a] uppercase tracking-wider mb-2">
                  Selected
                </p>
                <p className="text-[13px] text-[#f5f5f7]">
                  {features.length} features, {safetyFeatures.length} safety
                  features
                </p>
              </div>
            )}
          </div>
        );

      // Step 3 — Photos
      case 3:
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-[13px] font-semibold text-[#f5f5f7]">
                  Vehicle Photos
                </h3>
                <p className="text-[12px] text-[#8e8e9a] mt-0.5">
                  Upload up to {MAX_IMAGES} photos. First image will be the cover.
                </p>
              </div>
              <span className="text-[12px] text-[#8e8e9a] tabular-nums">
                {images.length}/{MAX_IMAGES}
              </span>
            </div>

            {/* Upload area */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading || images.length >= MAX_IMAGES}
              className="w-full py-10 border-2 border-dashed border-white/[0.08] rounded-xl flex flex-col items-center justify-center gap-3 hover:border-[#e63946]/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <>
                  <div className="w-8 h-8 border-2 border-[#e63946] border-t-transparent rounded-full animate-spin" />
                  <p className="text-[13px] text-[#8e8e9a]">
                    Uploading images…
                  </p>
                </>
              ) : (
                <>
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#8e8e9a"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="opacity-40"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                  <p className="text-[13px] text-[#8e8e9a]">
                    Click to upload or drag & drop
                  </p>
                  <p className="text-[11px] text-[#555]">
                    PNG, JPG, WEBP — max 10 MB each
                  </p>
                </>
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleImageUpload(e.target.files)}
            />

            {/* Image grid */}
            {images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {images.map((img, idx) => (
                  <div
                    key={img.publicId}
                    className="relative group aspect-[4/3] rounded-lg overflow-hidden border border-white/[0.06]"
                  >
                    <img
                      src={img.url}
                      alt={`Vehicle photo ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {idx === 0 && (
                      <span className="absolute top-2 left-2 px-2 py-0.5 bg-[#e63946] text-white text-[10px] font-bold rounded">
                        COVER
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(img.publicId)}
                      className="absolute top-2 right-2 w-7 h-7 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      // Step 4 — Pricing
      case 4:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Price ($)"
                value={form.price || ""}
                onChange={(v) => updateField("price", parseInt(v) || 0)}
                type="number"
                placeholder="ex: 25000"
                required
              />
              <Input
                label="Original Price ($)"
                value={form.originalPrice || ""}
                onChange={(v) => updateField("originalPrice", parseInt(v) || 0)}
                type="number"
                placeholder="ex: 30000 (optional — shows discount)"
              />
            </div>
            <Toggle
              label="Price is negotiable"
              checked={form.negotiable}
              onChange={(v) => updateField("negotiable", v)}
            />

            {/* Preview card */}
            <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-5">
              <h3 className="text-[13px] font-semibold text-[#f5f5f7] mb-3">
                Listing Preview
              </h3>
              <div className="flex items-start gap-4">
                {images[0] ? (
                  <img
                    src={images[0].url}
                    alt="Cover"
                    className="w-24 h-18 object-cover rounded-lg border border-white/[0.06]"
                  />
                ) : (
                  <div className="w-24 h-18 rounded-lg bg-white/[0.04] flex items-center justify-center">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#555"
                      strokeWidth="1.5"
                    >
                      <rect
                        x="3"
                        y="3"
                        width="18"
                        height="18"
                        rx="2"
                        ry="2"
                      />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                  </div>
                )}
                <div>
                  <p className="text-sm font-semibold text-[#f5f5f7]">
                    {form.year} {form.make || "—"} {form.model || "—"}
                    {form.trim ? ` ${form.trim}` : ""}
                  </p>
                  <p className="text-[#e63946] font-bold text-sm mt-0.5">
                    ${form.price.toLocaleString()}
                    {form.negotiable && (
                      <span className="text-[#8e8e9a] font-normal text-[11px] ml-1.5">
                        Negotiable
                      </span>
                    )}
                  </p>
                  <p className="text-[12px] text-[#8e8e9a] mt-1">
                    {form.mileage.toLocaleString()} mi ·{" "}
                    {FUEL_TYPE_OPTIONS.find((o) => o.value === form.fuelType)?.label ?? form.fuelType}{" "}
                    ·{" "}
                    {TRANSMISSION_OPTIONS.find((o) => o.value === form.transmission)?.label ?? form.transmission}
                  </p>
                  <p className="text-[11px] text-[#555] mt-0.5">
                    {form.city}
                    {form.country ? `, ${form.country}` : ""}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  // ── Main render ─────────────────────────────────────────────────────────

  return (
    <div className="flex-1 overflow-y-auto p-6 font-['DM_Sans',sans-serif]">
      <div className="max-w-[900px] mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[13px] text-[#8e8e9a] mb-4">
          <Link
            to="/my-listings"
            className="hover:text-[#f5f5f7] transition-colors no-underline text-[#8e8e9a]"
          >
            My Listings
          </Link>
          <span className="text-[#555]">/</span>
          <span className="text-[#f5f5f7]">New Listing</span>
        </div>

        <h1 className="font-['Playfair_Display',serif] text-[26px] font-bold text-[#f5f5f7] tracking-tight mb-1">
          Create New Listing
        </h1>
        <p className="text-sm text-[#8e8e9a] mb-6">
          Fill in the details below to list your vehicle for sale.
        </p>

        {/* Stepper */}
        <div className="flex items-center gap-1 mb-8">
          {STEPS.map((s, idx) => (
            <button
              key={s.key}
              type="button"
              onClick={() => idx <= step && setStep(idx)}
              className="flex items-center gap-2 group"
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold transition-colors ${
                  idx < step
                    ? "bg-[#10b981] text-white"
                    : idx === step
                      ? "bg-[#e63946] text-white"
                      : "bg-white/[0.06] text-[#555]"
                }`}
              >
                {idx < step ? (
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  idx + 1
                )}
              </div>
              <span
                className={`text-[12px] font-medium hidden sm:block ${
                  idx <= step ? "text-[#f5f5f7]" : "text-[#555]"
                }`}
              >
                {s.label}
              </span>
              {idx < STEPS.length - 1 && (
                <div
                  className={`w-6 h-px mx-1 ${idx < step ? "bg-[#10b981]" : "bg-white/[0.06]"}`}
                />
              )}
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-lg text-[13px] text-red-400">
            {error}
          </div>
        )}

        {/* Step content card */}
        <div className="bg-[#141417] border border-white/[0.04] rounded-xl p-6 mb-6">
          <h2 className="text-[16px] font-semibold text-[#f5f5f7] mb-5">
            {STEPS[step].label}
          </h2>
          {renderStep()}
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="px-5 py-2.5 bg-white/[0.04] border border-white/[0.06] rounded-lg text-[13px] text-[#8e8e9a] font-medium hover:bg-white/[0.06] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Back
          </button>

          {step < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
              disabled={!canProceed()}
              className="px-5 py-2.5 bg-[#e63946] text-white text-[13px] font-semibold rounded-lg hover:shadow-[0_4px_12px_rgba(230,57,70,0.3)] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting || !canProceed()}
              className="px-6 py-2.5 bg-[#e63946] text-white text-[13px] font-semibold rounded-lg hover:shadow-[0_4px_12px_rgba(230,57,70,0.3)] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Publishing…
                </>
              ) : (
                "Publish Listing"
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
