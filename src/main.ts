
import { IModelHost, SnapshotDb } from "@bentley/imodeljs-backend";
import { DbResult } from "@bentley/bentleyjs-core";
import * as yargs from "yargs";

const args = yargs
  .usage("Dump the Categories in a Snapshot iModel.\n\nUsage: $0 --input [Snapshot iModel]")
  .describe("input", "The path to the Snapshot iModel")
  .string("input")
  .alias("input", "i")
  .demandOption(["input"])
  .argv;

(async () => {
  await IModelHost.startup();
  const iModel = SnapshotDb.openFile(args.input as string);

  iModel.withPreparedStatement("SELECT ECInstanceId FROM bis.ViewDefinition", (stmt) => {
    while (stmt.step() === DbResult.BE_SQLITE_ROW) {
      const elementId = stmt.getValue(0).getId();
      const categoryName = iModel.elements.getElementProps(elementId).code.value;
      process.stdout.write(elementId + " - " + categoryName + "\n");
    }
  });
})().catch((error) => {
  process.stdout.write(`${error.message}\n${error.stack}\n`);
});
