public with sharing class dynamicTableController {
    @AuraEnabled(cacheable=true)
    public static Map<String, List<Map<String, String>>> getObjectsAndFields() {
        Map<String, List<Map<String, String>>> result = new Map<String, List<Map<String, String>>>();
        List<Schema.SObjectType> globalDesc = Schema.getGlobalDescribe().values();

        for (Schema.SObjectType sObjType : globalDesc) {
            String objName = sObjType.getDescribe().getName();
            if (!objName.endsWith('__Tag') && !objName.contains('History')) {
                Map<String, Schema.SObjectField> fieldsMap = sObjType.getDescribe().fields.getMap();
                List<Map<String, String>> fieldList = new List<Map<String, String>>();
                for (Schema.SObjectField field : fieldsMap.values()) {
                    Schema.DescribeFieldResult desc = field.getDescribe();
                    fieldList.add(new Map<String, String>{
                        'label' => desc.getLabel(),
                        'apiName' => desc.getName()
                    });
                }
                result.put(objName, fieldList);
            }
        }

        return result;
    }

    @AuraEnabled(cacheable=false)
    public static List<SObject> getRecords(String objectName, List<String> fields) {
        String fieldList = String.join(fields, ',');
        String query = 'SELECT ' + fieldList + ' FROM ' + objectName + ' LIMIT 100';
        return Database.query(query);
    }
}
