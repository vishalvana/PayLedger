export function calculateTripAmounts(route, preference) {
  if (preference === "BATTA_ONLY") {
    return {
      batta: route.batta_per_trip + route.salary_per_trip,
      salary: 0
    };
  }

  if (preference === "SALARY_ONLY") {
    return {
      batta: 0,
      salary: route.batta_per_trip + route.salary_per_trip
    };
  }

  return {
    batta: route.batta_per_trip,
    salary: route.salary_per_trip
  };
}
