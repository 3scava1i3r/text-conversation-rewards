import { IssueActivity } from "../src/issue-activity";
import { parseGitHubUrl } from "../src/start";

// Mock process.argv
const issueUrl =
  process.env.TEST_ISSUE_URL ?? "https://github.com/ubiquity-os-marketplace/text-conversation-rewards/issues/22";

jest.mock("../src/parser/command-line", () => {
  const cfg = require("./__mocks__/results/valid-configuration.json");
  const dotenv = require("dotenv");
  dotenv.config();
  return {
    stateId: 1,
    eventName: "issues.closed",
    authToken: process.env.GITHUB_TOKEN,
    ref: "",
    eventPayload: JSON.stringify(cfg),
  };
});

jest.mock("../src/helpers/get-comment-details", () => ({
  getMinimizedCommentStatus: jest.fn(),
}));

describe("GetActivity class", () => {
  const issue = parseGitHubUrl(issueUrl);
  const activity = new IssueActivity(issue);
  beforeAll(async () => {
    await activity.init();
  });

  it("should resolve all promises", async () => {
    expect(activity.self).toBeTruthy();
    expect(activity.events).toBeTruthy();
    expect(activity.comments).toBeTruthy();
    expect(Array.isArray(activity.linkedReviews)).toBeTruthy();
  });

  it("should create an instance of GetActivity", () => {
    expect(activity).toBeInstanceOf(IssueActivity);
  });

  it("should initialize `activity.self` as an object", () => {
    expect(typeof activity.self).toBe("object");
  });

  it("should initialize `activity.events` as an object", () => {
    expect(typeof activity.events).toBe("object");
  });

  it("should initialize `activity.comments` as an object", () => {
    expect(typeof activity.comments).toBe("object");
  });

  it("should initialize `activity.linkedReviews` as an array", () => {
    expect(Array.isArray(activity.linkedReviews)).toBe(true);
  });
});
