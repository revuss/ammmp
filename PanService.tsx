/* eslint-disable @typescript-eslint/no-explicit-any */
import AppLabelData from "@/ui/AppLabelData";
import { camelCaseToWords, usePanMutation } from "./subServiceHooks";
import SubServiceGeneric from "./GenericSubService";

export function PanService() {
  const formatPanDetails = (details: any) =>
    Object.keys(details).map((key) => (
      <AppLabelData
        key={key}
        label={camelCaseToWords(key)}
        data={details[key] || "N/A"}
        style="min-w-[15vw] p-1"
        dataStyle="min-w-[20vw]"
        textLength={300}
      />
    ));

  return (
    <SubServiceGeneric
      title="Pan Service"
      inputLabel="Pan Number"
      inputName="Pan Number"
      inputPlaceholder="Pan Number"
      validation={{
        required: "Pan Required",
        minLength: {
          value: 10,
          message: "PAN must be at least 10 characters long",
        },
      }}
      mutationHook={usePanMutation}
      formatDetails={formatPanDetails}
    />
  );
}
