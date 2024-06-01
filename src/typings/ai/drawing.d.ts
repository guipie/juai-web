import { DrawingTypeEnum, ExecutionStatuseEnum } from "../enums/drawing-enum";



declare namespace Drawing {
  interface Configuration {
    name: string,
    drawingType: DrawingTypeEnum,
    desc: string,
    tags?: string,
    request: any,
    api: string,
    example: { prompt: string, url: string, prompt_ex?: string }
  }
  // interface DrawingRequest {
  //   width: number,
  //   height: number,
  //   guidance_scale: number,
  //   high_noise_frac: number,
  //   seed: number,
  //   steps: number,
  //   use_refiner: boolean,
  //   scheduler: "KDPM2Discret",
  //   prompt: string,
  // }
  interface DrawingResponse {
    id: bigint;
    prompt: string;
    promptEn: string;
    ossUrl?: string;
    executionStatus?: ExecutionStatuseEnum //   executing,    success,    failed,    fileUploaded
    createUserId: bigint;
  }
  interface DrawingState {
    configurations: Configuration[],
  }
}
