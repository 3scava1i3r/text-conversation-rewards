import { beforeAll, describe, expect, it, jest } from "@jest/globals";
import { paginateGraphQL } from "@octokit/plugin-paginate-graphql";
import { Octokit } from "@octokit/rest";
import { Logs } from "@ubiquity-os/ubiquity-os-logger";
import { IssueActivity } from "../src/issue-activity";
import { parseGitHubUrl } from "../src/start";
import { ContextPlugin } from "../src/types/plugin-input";
import cfg from "./__mocks__/results/valid-configuration.json";

const issueUrl =
  process.env.TEST_ISSUE_URL ?? "https://github.com/ubiquity-os-marketplace/text-conversation-rewards/issues/22";

jest.unstable_mockModule("../src/helpers/get-comment-details", () => ({
  getMinimizedCommentStatus: jest.fn(),
}));

const customOctokit = Octokit.plugin(paginateGraphQL).defaults({ auth: process.env.GITHUB_TOKEN });

describe("GetActivity class", () => {
  const issue = parseGitHubUrl(issueUrl);
  const activity = new IssueActivity(
    {
      stateId: 1,
      eventName: "issues.closed",
      authToken: process.env.GITHUB_TOKEN,
      ref: "",
      config: cfg,
      logger: new Logs("debug"),
      octokit: new customOctokit(),
    } as unknown as ContextPlugin,
    issue
  );
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
