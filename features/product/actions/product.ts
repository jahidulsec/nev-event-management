"use server";

import { db } from "@/config/db";
import { handleError } from "@/lib/error";
import { response } from "@/lib/response";
import { revalidatePath } from "next/cache";
import { ProductsSchema, ProductsType, ProductType } from "./schema";
import { hashPassword } from "@/utils/password";

export const createProduct = async (data: ProductType) => {
  try {
    const product = await db.product.create({
      data: data,
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboardd/products");

    return response({
      success: true,
      message: "New product is created successfully",
      data: product,
    });
  } catch (error) {
    console.error(error);
    const err = handleError(error);
    return response({
      success: false,
      message: err.message ?? "Something went wrong",
    });
  }
};

export const updateProduct = async (id: string, data: ProductType) => {
  try {
    const product = await db.product.update({
      where: { id },
      data: {
        ...data,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboardd/products");

    return response({
      success: true,
      message: "product is updated successfully",
      data: product,
    });
  } catch (error) {
    console.error(error);
    const err = handleError(error);
    return response({
      success: false,
      message: err.message ?? "Something went wrong",
    });
  }
};

export const deleteProduct = async (id: string) => {
  try {
    const product = await db.product.delete({
      where: { id },
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboardd/products");

    return response({
      success: true,
      message: "Doctor is deleted successfully",
      data: product,
    });
  } catch (error) {
    console.error(error);
    const err = handleError(error);
    return response({
      success: false,
      message: err.message ?? "Something went wrong",
    });
  }
};

export const createProducts = async (data: ProductsType) => {
  try {
    const validatedData = ProductsSchema.parse(data);

    if (validatedData.length === 0) throw new Error("No column is included");

    for (let i = 0; i < validatedData.length; i++) {
      await db.product.upsert({
        where: {
          id: validatedData[i].slug,
        },
        create: {
          name: validatedData[i].name,
          id: validatedData[i].slug,
        },
        update: {
          name: validatedData[i].name,
          id: validatedData[i].slug,
        },
      });
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/products");

    return response({
      success: true,
      message: "New products is created successfully",
      data: [],
    });
  } catch (error) {
    console.error(error);
    const err = handleError(error);
    return response({
      success: false,
      message: err.message ?? "Something went wrong",
    });
  }
};
