type Step = {
  id: string
  name: string
}

type RegistrationStepperProps = {
  steps: Step[]
  currentStep: string
}

export function RegistrationStepper({
  steps,
  currentStep,
}: RegistrationStepperProps) {
  const currentStepIndex = steps.findIndex((step) => step.id === currentStep)
  const currentStepDetails = steps[currentStepIndex]
  const totalSteps = steps.length

  if (!currentStepDetails) {
    return null
  }

  return (
    <div className="text-center">
      <p className="text-sm font-medium text-muted-foreground">
        Step {currentStepIndex + 1} of {totalSteps}
      </p>
      <p className="text-lg font-semibold">{currentStepDetails.name}</p>
    </div>
  )
}
