import { dataSource } from "@simoko/shec/dist/loaders/database";
import { OnboardingState } from "../models/onboarding";

const OnboardingRepository = dataSource.getRepository(OnboardingState);

export default OnboardingRepository;
