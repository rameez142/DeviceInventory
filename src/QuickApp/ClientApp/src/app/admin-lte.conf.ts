export const adminLteConf = {
  skin: 'blue',
  sidebarLeftMenu: [
    {label: 'Home', route: 'home', iconClasses: 'fa fa-road'},
    {label: 'الصيانه',route: 'maintainence/patrolcars', iconClasses: 'fa fa-th-list', children: [
        {label: 'الدوريات', route: 'maintainence/patrolcars', iconClasses: 'fa fa-automobile'},
        {label: 'تقارير الاستلام والتسليم الأجهزة', route: 'maintainence/patrolcarsinventory', iconClasses: 'fa fa-calendar'},
        {label: 'الأجهزة', route: 'maintainence/handhelds', iconClasses: 'fa fa-fax'},
        {label: 'تقارير الاستلام والتسليم الدوريات', route: 'maintainence/handheldsinventory', iconClasses: 'fa fa-calendar'}
      ]},
      {label: 'الأحوال', route: 'dispatcher/dispatcher',iconClasses: 'fa fa-eye', children: [
        {label: 'كشف التوزيع', route: 'dispatcher/dispatcher', iconClasses: 'fa fa-calendar'}
      ]},
    {
      label: 'العمليات', route: 'operations/operationsopslive',iconClasses: 'fa fa-arrows', children: [
        {label: 'الكشف', route: 'operations/operationsopslive', iconClasses: 'fa fa-calendar'},
        {label: 'البلاغات', route: 'operations/incidents', iconClasses: 'fa fa-user-secret'}

      ]}
  ]
};
