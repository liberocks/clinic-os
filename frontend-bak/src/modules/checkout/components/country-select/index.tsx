import { forwardRef, useImperativeHandle, useMemo, useRef } from "react";

import type { Region } from "@medusajs/medusa";
import NativeSelect, {
	type NativeSelectProps,
} from "@modules/common/components/native-select";

const CountrySelect = forwardRef<
	HTMLSelectElement,
	NativeSelectProps & {
		region?: Region;
	}
>(({ placeholder = "Country", region, defaultValue, ...props }, ref) => {
	const innerRef = useRef<HTMLSelectElement>(null);

	useImperativeHandle<HTMLSelectElement | null, HTMLSelectElement | null>(
		ref,
		() => innerRef.current,
	);

	const countryOptions = useMemo(() => {
		if (!region) {
			return [];
		}

		return region.countries.map((country) => ({
			value: country.iso_2,
			label: country.display_name,
		}));
	}, [region]);

	return (
		<NativeSelect
			ref={innerRef}
			placeholder={placeholder}
			defaultValue={defaultValue}
			{...props}
		>
			{countryOptions.map(({ value, label }, index) => (
				<option key={index} value={value}>
					{label}
				</option>
			))}
		</NativeSelect>
	);
});

CountrySelect.displayName = "CountrySelect";

export default CountrySelect;
