/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactNode, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { SubSerContainer } from "./SubSerContainer";
import AppFormInput from "@/ui/AppFormInput";
import { IconInput } from "@/components/ui/input";
import AppSpinner from "@/ui/AppSpinner";
import { Button } from "@/components/ui/button";

interface GenericFormProps<FormValues> {
  title: string;
  inputLabel: string;
  inputName: keyof FormValues;
  inputPlaceholder: string;
  validation: any;
  mutationHook: any;
  formatDetails: (details: any) => ReactNode;
}

function SubServiceGeneric<FormValues extends FieldValues>({
  title,
  inputLabel,
  inputName,
  inputPlaceholder,
  validation,
  mutationHook,
  formatDetails,
}: GenericFormProps<FormValues>) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>();

  const {
    getValues,
    gettingValues,
    isSuccess,
    data: apiData,
    isError,
    error,
  } = mutationHook();

  const handleClear = () => {
    reset();
    setIsSubmitted(false);
  };

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    getValues({ [inputName]: data[inputName] });
    setIsSubmitted(true);
  };

  const status = apiData?.data?.status;
  const details = apiData?.data?.details;

  return (
    <>
      <div className="w-full space-y-5">
        <SubSerContainer title={title}>
          <div className="w-full rounded-b-md border-2 border-t-0 border-primary">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex  gap-5 px-5 py-3 pt-5  md:w-[68%]"
            >
              <div className="w-full">
                <AppFormInput>
                  <IconInput
                    accept={inputPlaceholder}
                    maxLength={10}
                    autoComplete="off"
                    {...register(inputName as any, validation)}
                    className="-mr-4 rounded py-2 font-medium uppercase placeholder:capitalize lg:ml-0 lg:w-full"
                  />

                  {errors[inputName] && (
                    <span className="mx-2 mt-1 font-semibold text-red-500">
                      {errors[inputName]?.message as ReactNode}
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
            {gettingValues ? (
              <AppSpinner />
            ) : isSuccess && status?.code === 1000 ? (
              <div className="w-full rounded-b-md border-[3px] border-t-0 border-green-400">
                <div className="grid max-h-[40vh] grid-cols-2 gap-2 overflow-auto px-5 py-5">
                  {details && Object.keys(details).length > 0 ? (
                    formatDetails(details)
                  ) : (
                    <p>No data available</p>
                  )}
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

export default SubServiceGeneric;
