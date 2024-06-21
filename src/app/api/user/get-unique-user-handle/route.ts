import { NextRequest, NextResponse } from 'next/server';
import * as API from 'aws-amplify/api/server';
import { AWS_API_NAME, endpoints } from '@/lib/awsApi/endpoints';
import { runWithAmplifyServerContext } from '@/lib/utils/awsServer/runWithAmplifyServerContext';
import { cookies } from 'next/headers';

type ResponseBody = {
  userHandle?: string;
  message?: string;
};

export async function POST(
  req: NextRequest
): Promise<NextResponse<ResponseBody>> {
  const callAwsApi = async (base: string) => {
    // Call AWS API to generate a unique user handle
    try {
      const response = await runWithAmplifyServerContext({
        nextServerContext: { cookies },
        async operation(contextSpec) {
          return await API.post(contextSpec, {
            apiName: AWS_API_NAME,
            path: endpoints.user.getUniqueUserHandle,
            options: { queryParams: { base } },
          }).response;
        },
      });
      if (response.statusCode === 200) {
        const data = (await response.body.json()) as ResponseBody;
        return NextResponse.json(data, { status: 200 });
      }
    } catch (error) {
      console.error(error);
    }
    return NextResponse.json(
      { message: 'Failed to generate unique user handle' },
      { status: 500 }
    );
  };

  const { base } = await req.json();
  if (base) {
    return await callAwsApi(base);
  }
  return NextResponse.json(
    { message: 'Invalid request, "base" is missing from request body.' },
    { status: 400 }
  );
}
