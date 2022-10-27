const formatReports = (reports: {}[], solicitors: {}[]) => {
  const reportsWithSolicitorID = reports.map((report: any) => {
    solicitors.forEach((solicitor: any) => {
      if (
        solicitor["name"] === report.solicitor &&
        solicitor["location"] === report.location
      ) {
        report["solicitor_id"] = solicitor["solicitor_id"];
        delete report.solicitor;
        delete report.location;
      }
    });
    return report;
  });
  return reportsWithSolicitorID;
};

export default formatReports;
