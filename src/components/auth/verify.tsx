"use client";
import React from "react";
import Link from "next/link";
import { sendRequest } from "@/utils/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

interface ValuesForm {
  id: string;
  code: string;
}

const Verify = (props: any) => {
  const { id } = props;
  console.log(">>> check id:", id);
  const router = useRouter();

  // const onFinish = async (values: ValuesForm) => {
  //   const { id, code } = values;
  //   console.log('>>> check id:', id);
  //   console.log('>>> check code:', code);
  //   console.log('>>> check values:', values);
  //   const res = await sendRequest<IBackendRes<any>>({
  //     method: "POST",
  //     url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/check-code`,
  //     body: {
  //       id, code
  //     },
  //   });
  //   console.log(">>> check res: ", res);
  //   if (res?.data) {
  //     toast("Kích hoạt tài khoản thành công!");
  //     router.push(`/auth/login`);
  //   } else {
  //     toast(res?.message);
  //   }
  // };

  const onFinish = async (form: HTMLFormElement) => {
    const formData = new FormData(form);
    const code = formData.get("code") as string;

    console.log(">>> check code:", code);
    console.log(">>> check values:", { id, code });

    const res = await sendRequest<IBackendRes<any>>({
      method: "POST",
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/check-code`,
      body: { id, code },
    });

    console.log(">>> check res: ", res);
    if (res?.data) {
      toast("Kích hoạt tài khoản thành công!");
      router.push(`/auth/login`);
    } else {
      toast(res?.message);
    }
  };

  return (
    <div className="flex justify-center mt-8">
      <div className="w-full max-w-lg p-4 border border-gray-300 rounded-md">
        <h2 className="text-lg font-semibold mb-4">Kích hoạt Tài Khoản</h2>
        <form onSubmit={(e) => { e.preventDefault(); onFinish(e.target as HTMLFormElement); }} className="space-y-4">
          <div className="flex flex-col">
            <label htmlFor="id" className="mb-1">
              Id
            </label>
            <input
              id="id"
              name="id"
              type="text"
              defaultValue={id}
              disabled
              className="p-2 border border-gray-300 rounded-md"
            />
          </div>
          <p className="text-sm text-gray-600">
            Mã code đã được gửi tới email đăng ký, vui lòng kiểm tra email
          </p>
          <hr className="my-4" />
          <div className="flex flex-col">
            <label htmlFor="code" className="mb-1">
              Code
            </label>
            <input
              id="code"
              name="code"
              type="text"
              required
              className="p-2 border border-gray-300 rounded-md"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Submit
          </button>
        </form>
        <Link
          href="/"
          className="flex items-center mt-4 text-blue-500 hover:underline"
        >
          <ArrowLeft className="mr-1" /> Quay lại trang chủ
        </Link>
        <hr className="my-4" />
        <div className="text-center">
          Đã có tài khoản?{" "}
          <Link href="/auth/login" className="text-blue-500 hover:underline">
            Đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Verify;
