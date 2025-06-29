package br.com.o_tab.agropec.model;

public enum UserRole {
    SUPER_ADMIN("super_admin"),
    ADMIN("admin");

    private String role;

    UserRole(String role){
        this.role = role;
    }

    public String getRole(){
        return role;
    }
}
