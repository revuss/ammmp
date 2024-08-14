/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { IconInput } from "@/components/ui/input";
import AppFormInput from "@/ui/AppFormInput";
import { SubmitHandler, useForm } from "react-hook-form";
import { camelCaseToWords, usePanMutation } from "./subServiceHooks";
import { SubSerContainer } from "./SubSerContainer";
import AppSpinner from "@/ui/AppSpinner";
import AppLabelData from "@/ui/AppLabelData";
import briefViewConfigJson from "../../servicelogs/briefViewConfig.json";

interface FormValues {
  panNumber: string;
}

function PanServiceMain() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>();

  const {
    getPanValues,
    gettingPanValues,
    isSuccess,
    data: apiData,
    isError,
    error,
  } = usePanMutation();

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    getPanValues({ pan: data.panNumber });
    setIsSubmitted(true);
  };

  const handleClear = () => {
    reset();
    setIsSubmitted(false);
  };

  const status = apiData?.data?.status;
  const panDetails = apiData?.data?.panDetails;

  const panConfig = briefViewConfigJson.PAN?.response || [];

  return (
    <>
      <div className="w-full space-y-5">
        <SubSerContainer title="PAN Service">
          <div className="w-full rounded-b-md border-2 border-t-0 border-primary">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex  gap-5 px-5 py-3 pt-5  md:w-[68%]"
            >
              <div className="w-full">
                <AppFormInput>
                  <IconInput
                    accept="PAN Number"
                    maxLength={10}
                    autoComplete="off"
                    {...register("panNumber", {
                      required: "PAN required",
                      minLength: {
                        value: 10,
                        message: "PAN must be at least 10 characters long",
                      },
                    })}
                    className="-mr-4 rounded py-2 font-medium uppercase placeholder:capitalize lg:ml-0 lg:w-full"
                  />
                  {errors.panNumber && (
                    <span className="mx-2 mt-1 font-semibold text-red-500">
                      {errors.panNumber.message}
                    </span>
                  )}
                </AppFormInput>
              </div>

              <Button
                variant="outline"
                type="button"
                className="w-[30%]"
                onClick={handleClear}
              >
                Clear
              </Button>
              <Button type="submit" className="w-[30%]">
                Verify
              </Button>
            </form>
          </div>
        </SubSerContainer>

        {isSubmitted && (
          <SubSerContainer title="Details">
            {gettingPanValues ? (
              <AppSpinner />
            ) : isSuccess && status?.code === 1000 ? (
              <div className="w-full rounded-b-md border-[3px] border-t-0 border-green-400">
                <div className="grid max-h-[40vh] grid-cols-2 gap-2 overflow-auto px-5 py-5">
                  {panDetails && Object.keys(panDetails).length > 0 ? (
                    Object.keys(panDetails).map((key) => (
                      <>
                        <AppLabelData
                          key={key}
                          label={camelCaseToWords(key)}
                          data={
                            panDetails[key as keyof typeof panDetails] || "N/A"
                          }
                          style="min-w-[15vw] p-1"
                          dataStyle="min-w-[20vw]"
                          textLength={300}
                        />
                      </>
                    ))
                  ) : (
                    <p className="flex justify-center">No data available</p>
                  )}
                  {panConfig.map((item, index) => (
                    <AppLabelData
                      key={index}
                      label={camelCaseToWords(item.displayName)}
                      data={
                        panDetails
                          ? panDetails[item.key as keyof typeof panDetails] ||
                            "N/A"
                          : "N/A"
                      }
                      style="min-w-[15vw] p-1"
                      dataStyle="min-w-[20vw]"
                      textLength={300}
                    />
                  ))}
                </div>
              </div>
            ) : isError ? (
              <div className="flex justify-center rounded-b-lg border-2 border-t-0 border-red-500 p-2 py-2 pt-1 font-semibold text-red-500">
                {error.response?.data?.status?.apiStatusMessage ||
                  "Invalid details"}
              </div>
            ) : (
              <div className="flex justify-center rounded-b-lg border-2 border-t-0 border-red-500 p-2 py-2 pt-1 font-semibold text-red-500">
                {status.apiStatusMessage || "Error fetching Data"}
              </div>
            )}
          </SubSerContainer>
        )}
      </div>
    </>
  );
}

export default PanServiceMain;
