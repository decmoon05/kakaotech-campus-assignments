import { describe, it, expect } from "vitest";
import { backendApi } from "../lib/api";

describe("backendApi axios 인스턴스", () => {
  it("인스턴스가 생성됨", () => {
    expect(backendApi).toBeDefined();
    expect(typeof backendApi.get).toBe("function");
    expect(typeof backendApi.post).toBe("function");
    expect(typeof backendApi.put).toBe("function");
    expect(typeof backendApi.delete).toBe("function");
  });

  it("baseURL 가 환경변수 또는 기본값으로 설정됨", () => {
    const baseURL = backendApi.defaults.baseURL;
    expect(baseURL).toBeTruthy();
    expect(baseURL).toMatch(/^https?:\/\//);
  });

  it("기본 timeout 이 5초", () => {
    expect(backendApi.defaults.timeout).toBe(5000);
  });
});
