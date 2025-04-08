export function ProgressStepper({ currentStep, steps }) {
  const getProgressWidth = () => {
    const stepPercentage = 100 / steps.length;
    return `${stepPercentage * currentStep}%`;
  };

  return (
    <div className="px-4 py-4 sm:px-6 border-bottom border-secondary bg-light">
      <div className="d-flex align-items-center">
        <div className="flex-grow-1">
          <div className="position-relative">
            <div className="overflow-hidden h-2 d-flex rounded bg-secondary-subtle">
              <div
                className="transition-all duration-500 ease-in-out bg-primary rounded"
                style={{ width: getProgressWidth() }}
              />
            </div>
            <div className="d-flex justify-content-between text-xs mt-2">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className={
                    currentStep >= index + 1
                      ? "text-primary fw-medium"
                      : "text-secondary"
                  }
                >
                  {step.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
